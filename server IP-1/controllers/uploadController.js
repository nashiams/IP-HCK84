import multer from "multer";
import unzipper from "unzipper";
import path from "path";
import generateStructured from "../services/geminiService.js";

// === Multer Setup ===
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only zip files are allowed"));
    }
  },
}).single("zipFile");

// === Controller Class ===
class UploadController {
  static shouldProcessFile(filePath) {
    const skipFolders = [
      "node_modules",
      ".git",
      "dist",
      "build",
      ".next",
      "coverage",
    ];
    if (skipFolders.some((folder) => filePath.includes(folder))) return false;

    const ext = path.extname(filePath).toLowerCase();
    const validExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".json",
      ".html",
      ".css",
      ".scss",
      ".sql",
      ".md",
    ];
    return validExtensions.includes(ext);
  }

  static async unzipAndConcatenate(buffer) {
    let combinedCode = "";
    const processedFiles = [];

    const directory = await unzipper.Open.buffer(buffer);
    for (const file of directory.files) {
      if (
        file.type === "File" &&
        UploadController.shouldProcessFile(file.path)
      ) {
        const content = await file.buffer();
        combinedCode += `\n\n// ===== FILE: ${file.path} =====\n`;
        combinedCode += content.toString("utf8");
        processedFiles.push(file.path);
      }
    }

    console.log(`Processed ${processedFiles.length} files from ZIP`);
    return combinedCode;
  }

  static splitIntoChunks(code, maxSize = 100000) {
    if (code.length <= maxSize) return [code];

    const chunks = [];
    const lines = code.split("\n");
    let currentChunk = "";

    for (const line of lines) {
      if (
        currentChunk.length + line.length > maxSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk);
        currentChunk = line + "\n";
      } else {
        currentChunk += line + "\n";
      }
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  }

  static async analyzeChunk(checklist, codeChunk, chunkIndex, totalChunks) {
    const promptText = `
You are an AI code reviewer. Given the following checklist:
${checklist.map((item, i) => `${i + 1}. ${item.itemDescription}`).join("\n")}

This is chunk ${chunkIndex + 1} of ${totalChunks}:
\`\`\`
${codeChunk}
\`\`\`

Reply with a structured JSON for each requirement as:
- requirement: same string as provided
- status: "complete" or "incomplete"
- evidence: short reason or location if complete, or say "Not found"
    `;

    const responseSchema = {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              requirement: { type: "string" },
              status: { type: "string", enum: ["complete", "incomplete"] },
              evidence: { type: "string" },
            },
            required: ["requirement", "status", "evidence"],
          },
        },
      },
      required: ["results"],
    };

    try {
      const parsed = await generateStructured(promptText, responseSchema);
      return parsed.results;
    } catch (error) {
      console.error(`Gemini error on chunk ${chunkIndex + 1}:`, error);
      throw new Error("Failed to analyze code with Gemini");
    }
  }

  static mergeResults(checklist, allChunkResults) {
    return checklist.map((item) => {
      const requirement = item.itemDescription;
      let isCompleted = false;
      const evidenceList = [];

      for (
        let chunkIndex = 0;
        chunkIndex < allChunkResults.length;
        chunkIndex++
      ) {
        const chunkResults = allChunkResults[chunkIndex];
        const found = chunkResults.find((r) => r.requirement === requirement);

        if (found && found.status === "complete") {
          isCompleted = true;
          evidenceList.push(`[Chunk ${chunkIndex + 1}] ${found.evidence}`);
        }
      }

      return {
        itemDescription: requirement,
        isCompleted,
        evidence: isCompleted
          ? evidenceList.join(" | ")
          : "Not found in any code chunk",
      };
    });
  }

  static uploadAndAnalyze(req, res, next) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: true, message: err.message });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ error: true, message: "No file uploaded" });
      }

      try {
        let checklist;
        try {
          checklist = JSON.parse(req.body.checklist);
        } catch (e) {
          return res
            .status(400)
            .json({ error: true, message: "Invalid checklist format" });
        }

        if (!Array.isArray(checklist)) {
          return res
            .status(400)
            .json({ error: true, message: "Checklist array is required" });
        }

        console.log(`Analyzing against ${checklist.length} requirements...`);

        const allCode = await UploadController.unzipAndConcatenate(
          req.file.buffer
        );
        if (!allCode || allCode.trim().length === 0) {
          return res
            .status(400)
            .json({ error: true, message: "No code files found in ZIP" });
        }

        const codeChunks = UploadController.splitIntoChunks(allCode);
        console.log(`Split code into ${codeChunks.length} chunks`);

        const allResults = [];
        for (let i = 0; i < codeChunks.length; i++) {
          console.log(`Analyzing chunk ${i + 1}/${codeChunks.length}...`);
          const chunkResults = await UploadController.analyzeChunk(
            checklist,
            codeChunks[i],
            i,
            codeChunks.length
          );
          allResults.push(chunkResults);
        }

        const finalChecklist = UploadController.mergeResults(
          checklist,
          allResults
        );
        const completedCount = finalChecklist.filter(
          (item) => item.isCompleted
        ).length;
        const totalCount = finalChecklist.length;

        res.json({
          success: true,
          summary: {
            totalRequirements: totalCount,
            completedRequirements: completedCount,
            completionPercentage: Math.round(
              (completedCount / totalCount) * 100
            ),
          },
          checklist: finalChecklist,
        });
      } catch (error) {
        console.error("Analysis error:", error);
        next(error);
      }
    });
  }
}

export default UploadController;
