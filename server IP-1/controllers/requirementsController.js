const geminiService = require("../services/geminiService");

class RequirementsController {
  static async submitRequirements(req, res) {
    try {
      const { requirements } = req.body;
      const userId = req.user.id; // From auth middleware

      if (!requirements) {
        return res.status(400).json({ message: "Requirements are required" });
      }

      // Gemini Prompt: Simplify into a checklist
      const geminiPrompt = `
You are a software engineering assistant. Your task is to read the following exam project requirements and return a simplified, developer-friendly checklist. 
Each item should be clear, concise, and easy to verify. Use a format that can be easily checked off like:

- [ ] Use client-server architecture
- [ ] Implement REST API with CRUD
- [ ] Upload and analyze ZIP files
- [ ] Use at least 2 external APIs

Here are the raw exam requirements:

${requirements}

Return only the checklist in bullet point format. Do not explain or add extra content.
      `.trim();

      const simplifiedChecklist = await geminiService.analyzePrompt(
        geminiPrompt
      );

      // (Optional) You can save the requirements and checklist to DB later if needed.

      return res.status(200).json({
        message: "Requirements accepted",
        simplifiedChecklist,
        next: "Now upload your file",
      });
    } catch (error) {
      console.error("Error processing requirements:", error);
      return res
        .status(500)
        .json({ message: "Failed to process requirements" });
    }
  }
}

module.exports = RequirementsController;
