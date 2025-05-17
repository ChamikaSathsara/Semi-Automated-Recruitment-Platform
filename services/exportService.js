const { Parser } = require("json2csv");
const FilteredCandidate = require("../models/FilteredCandidate");

exports.exportFilteredCSV = async () => {
  const data = await FilteredCandidate.find().populate("application");
  const plainData = data.map((d) => ({
    id: d._id,
    candidate: d.application.candidate,
    job: d.application.job,
    score: d.application.score,
  }));
  const parser = new Parser();
  return parser.parse(plainData);
};

exports.exportFilteredJSON = async () => {
  const data = await FilteredCandidate.find().populate("application");
  return JSON.stringify(data);
};
