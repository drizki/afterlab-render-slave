const fs = require("fs");
const { spawn } = require("child_process");
const job = require("./job");

const init = async () => {
  // Prepare job details
  let config = JSON.parse(fs.readFileSync("./config.json"));

  // Register the job to the server
  try {
    await job.create(config);
  } catch (error) {
    console.log("error creating job", error);
    process.exitCode(1);
    process.exit();
  }

  // Spawn render job
  let args = job.getArgs(config);
  const child = spawn("blender", args);

  // Listen on stdout
  child.stdout.on("data", async data => {
    const progress = data.toString().replace(/(\r\n|\n|\r)/gm, "");
    try {
      if (progress.length) {
        console.log(progress);
        await job.progress(config.id, progress);
      }
    } catch (error) {
      console.log(error);
      await job.error(config.id, error);
    }
  });

  // Listen on stderr
  child.stderr.on("data", async error => {
    try {
      await job.error(config.id, error);
    } catch (error) {
      await job.error(config.id, error);
    }
  });

  // Listen process exit with code
  child.on("exit", async code => {
    await job.completed(config.id);
    console.log("Job finished");
    process.exit();
  });
};

init();
