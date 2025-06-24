const { default: generateStructured } = require("../services/geminiService");

class RequirementsController {
  // Define the JSON Schema for the checklist.
  // This schema guides Gemini to produce output in the desired structured format.
  static checklistSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Text Summary Checklist",
    // Removed description for brevity as per request
    type: "object",
    properties: {
      summary: {
        type: "string",
        // Removed description for brevity as per request
      },
      checklist: {
        type: "array",
        // Removed description for brevity as per request
        items: {
          type: "object",
          properties: {
            itemDescription: {
              type: "string",
              // Removed description for brevity as per request
            },
            isCompleted: {
              type: "boolean",
              default: false,
            },
            // Removed priority and dueDate as per request
          },
          // Ensure these properties are always present in each checklist item
          required: ["itemDescription", "isCompleted"],
          // Disallow any additional properties not defined in the schema
          additionalProperties: false,
        },
        // Ensure at least one checklist item is generated
        minItems: 1,
        // Increased maxItems to 30 as per request
        maxItems: 30,
        // Removed unevaluatedItems as per request
      },
    },
    // Ensure both summary and checklist are present in the top-level response
    required: ["summary", "checklist"],
    // Disallow any additional top-level properties
    additionalProperties: false,
  };

  /**
   * Handles the request to submit requirements and generate a simplified checklist.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  static async submitRequirements(req, res) {
    try {
      // Extract the 'requirements' text from the request body.
      // This assumes Postman sends a JSON body like: { "requirements": "Your long text here..." }
      const { requirements } = req.body;
      // const userId = req.user.id; // Placeholder: If you have auth middleware, uncomment this.

      // Basic input validation: Check if requirements are provided and are a string.
      if (
        !requirements ||
        typeof requirements !== "string" ||
        requirements.trim().length === 0
      ) {
        return res.status(400).json({
          message: "Requirements text is required and cannot be empty.",
        });
      }

      // The accurate prompt for the Gemini model.
      // This prompt instructs the model to summarize and extract actionable items
      // into a JSON checklist, adhering to the provided schema.
      // A few-shot example is included for better consistency in output style.
      const geminiPrompt = `
You are an expert assistant tasked with summarizing provided text and extracting key actionable items or important takeaways into a structured JSON checklist.
Each item in the checklist should be concise and clearly describe a single point.
The output must strictly adhere to the JSON schema provided.

---
Example Input:
"The project meeting covered several points. We need to finalize the budget by Friday, assign tasks for the marketing campaign, and schedule a follow-up with client X next week. John will handle the budget, Sarah the marketing tasks, and I'll schedule the client meeting."
Example Output:
{
  "summary": "The project meeting discussed budget finalization, marketing task assignment, and client follow-up scheduling.",
  "checklist": [
    { "itemDescription": "Finalize the budget", "isCompleted": false },
    { "itemDescription": "Assign tasks for the marketing campaign", "isCompleted": false },
    { "itemDescription": "Schedule a follow-up with client X", "isCompleted": false }
  ]
}
---

Here is the text to summarize and convert into a checklist:
---
${requirements}
---

Please provide the JSON checklist based on the summary.
`.trim(); // Using .trim() removes leading/trailing whitespace from the multi-line string.

      // Configure the generation parameters for the Gemini API call.
      // responseMimeType and responseSchema are crucial for structured output.
      // temperature: Lower value for more deterministic/factual output, good for summarization.
      // maxOutputTokens: Sufficient tokens to ensure the entire JSON structure is generated.
      const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: RequirementsController.checklistSchema,
        temperature: 0.4, // A good balance for factual extraction and some flexibility
        maxOutputTokens: 2048, // Generous token limit for the JSON output
        // thinkingConfig: { thinkingBudget: -1 } // Uncomment for Gemini 2.5 models for better reasoning
      };

      // Define safety settings. Adjust as per your application's requirements.
      // For general text summarization, default safety settings are often sufficient,
      // but you can customize them if needed.
      const safetySettings = []; // Or define specific settings, e.g., to block harmful content

      // Call the geminiService to generate the structured checklist.
      // The generateStructured method handles the API call and JSON parsing.
      const simplifiedChecklist = await generateStructured(
        geminiPrompt,
        RequirementsController.checklistSchema // Pass the schema again for clarity, though it's in config
      );

      // (Optional) You can save the original requirements and the generated checklist
      // to a database here if persistence is needed.
      // Example: await someDbModel.create({ userId, originalRequirements: requirements, checklist: simplifiedChecklist });

      // Send a successful response with the generated simplified checklist.
      return res.status(200).json({
        message: "Requirements accepted and summarized into a checklist",
        simplifiedChecklist,
        next: "Now you can use this checklist for your project tasks.",
      });
    } catch (error) {
      // Log the error for debugging purposes.
      console.error(
        "Error in RequirementsController.submitRequirements:",
        error
      );
      // Send an appropriate error response to the client.
      res.status(500).json({
        message: "Failed to process requirements and generate checklist.",
        details: error.message, // Provide error details for easier debugging on the client-side
        // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Optional: include stack in dev
      });
    }
  }
}

// Export the controller for use in your Express routes.
module.exports = RequirementsController;
