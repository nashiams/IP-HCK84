class RequirementsController {
  static async requirements(req, res, next) {
    try {
      const { requirements } = req.body;

      // Validate that requirements are provided
      if (!requirements || requirements.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Requirements are required",
        });
      }

      // Since we're not storing requirements in database according to the architecture,
      // we just validate and confirm receipt
      //   console.log("Requirements received:", requirements);

      // Respond with success message prompting for file upload
      res.status(200).json({
        success: true,
        message: "Requirements accepted, now upload your file",
        data: {
          requirements: requirements,
          nextStep: "upload",
        },
      });
    } catch (error) {
      next();
    }
  }
}
module.exports = RequirementsController;
