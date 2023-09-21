const { publicKey, privateKey } = require("./generateKeys");
const fs = require("fs");
const path = require("path");

//Create Private-Public Key Files with given name
function writeKeys(name) {
  try {
    fs.writeFileSync(
      path.join(__dirname, "..", "keyGens", `private${name}Key.pem`),
      privateKey,
      { flag: "w" }
    );
    fs.writeFileSync(
      path.join(__dirname, "..", "keyGens", `public${name}Key.pem`),
      publicKey,
      { flag: "w" }
    );
  } catch (error) {
    console.log("utils/writeKeys", error.message);
  }
}

module.exports = writeKeys;
