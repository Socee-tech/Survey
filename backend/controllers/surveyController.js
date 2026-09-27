import express from "express";
import survey from "../models/survey.js";

const Router = express.Router();

Router.post("/", async (req, res) => {
  const answers = req.body.body;
  console.log("Received survey answers:", answers);
  try {
    const response = await survey.create(answers);
    res
      .status(201)
      .json({ message: "Response submitted successfully", response });
  } catch (error) {
    console.error("Error submitting response:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while submitting the response",
        error,
      });
  }
});

Router.get("/", async (req, res) => {
  try {
    const responses = await survey.find();
    res
      .status(200)
      .json({ message: "Responses retrieved successfully", responses });
  } catch (error) {
    console.error("Error retrieving responses:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while retrieving the responses",
        error,
      });
  }
});

Router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedResponse = await survey.findByIdAndDelete(id);
    if (!deletedResponse) {
      return res.status(404).json({ message: "Response not found" });
    }
    res
      .status(200)
      .json({ message: "Response deleted successfully", deletedResponse });
  } catch (error) {
    console.error("Error deleting response:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the response",
        error,
      });
  }
});

export default Router;
