const database = require("./firebase").database;
const moment = require("moment");

const log = {
  progress: (job, progress) => {},
  error: async (job, error) => {}
};

module.exports = log;
