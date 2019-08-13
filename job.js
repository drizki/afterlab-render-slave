const database = require("./firebase").database;
const moment = require("moment");
const job = {
  create: config => {
    return new Promise(async (resolve, reject) => {
      try {
        details = {
          config,
          completed: false,
          status: "initiated",
          started: moment().format(),
          updated: moment().format(),
          uid: "UUID"
        };
        await database.ref("jobs/" + config.id).set(details);
        resolve(details);
      } catch (error) {
        reject(error);
      }
    });
  },

  completed: id => {
    return new Promise(async (resolve, reject) => {
      try {
        await database
          .ref("jobs/" + id)
          .update({ completed: true, updated: moment().format() });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  status: (id, status) => {
    return new Promise(async (resolve, reject) => {
      try {
        await database.ref("jobs/" + id).update({ status: status });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  progress: (id, progress) => {
    const processRaw = async progress => {
      return new Promise(async (resolve, reject) => {
        const splitSpace = progress.split(" ");
        const first = splitSpace[0];
        const splitColon = first.split(":");

        if (splitSpace[0] == "Read") {
          // Reading blender file
          try {
            await job.status(id, "Reading blender file...");
          } catch (error) {
            reject(error);
          }
        }

        if (splitColon[0] == "Fra") {
          // Rendering frame, update status to rendering current frame
          try {
            await job.status(id, "Rendering frame " + splitColon[1]);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }

        if (splitColon[0] == "Saved") {
          // Saving output, update status to saving output
          try {
            await job.status(id, "Saving rendered file");
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }

        if (progress == "Blender quit") {
          try {
            await job.status(id, "Blender quit");
            resolve(true);
          } catch (error) {
            reject(error);
          }
        }
      });
    };

    return new Promise(async (resolve, reject) => {
      try {
        console.log(progress);
        await database.ref("/logs/" + id).push({
          severity: "info",
          raw: progress,
          _timestamp: moment().format()
        });
        await processRaw(progress);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  error: (id, error) => {
    database.ref("/logs/" + id).push({
      severity: "error",
      raw: error,
      _timestamp: moment().format()
    });
  },

  getArgs: config => {
    let args = [];
    args.push("-b");
    args.push(config.file);

    if (config.type == "-a") {
      args.push("-a");
    }

    if (config.autorunScripts) {
      args.push("-y");
    }

    args;
    return args;
  }
};

module.exports = job;
