import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  access: { type: String, required: true },
  challenge: { type: String, required: true },
  clubs: { type: String, required: true },
  confidence: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  events: { type: String, required: true },
  experience: { type: String, required: true },
  focus: { type: String, required: true },
  internet: { type: String, required: true },
  languages: { type: String, required: true },
  learning: { type: String, required: true },
  major: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  projectType: { type: String, required: true },
  projects: { type: String, required: true },
  studyLevel: { type: String, required: true },
  support: { type: String, required: true },
  tools: { type: String, required: true },
  university: { type: String, required: true },
  updates: { type: String, required: true },
  year: { type: String, required: true },
});

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;
