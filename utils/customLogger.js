const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;

async function customLogger(message, filename) {
  //Checks/Create Directory called Logs
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "Logs"))) {
      const dir = await fsp.mkdir(path.join(__dirname, "..", "Logs"));
      if (!dir) {
        throw new Error("Failed to create Logs Directory");
      }
    }
    //Message Format
    const id = uuid();
    const date = format(new Date(), "yyyy-LLL-dd\tpp");
    const finalMsg = `${id}\t${date}\t${message}\n`;

    //Create/Append to Log File
    await fsp.writeFile(
      path.join(__dirname, "..", "Logs", filename),
      finalMsg,
      { flag: "a" }
    );
  } catch (error) {
    console.log("utils/customLogger", error.message);
  }
}

module.exports = customLogger;
