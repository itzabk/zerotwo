const crypto = require("crypto");

//Generate Private-Public Keys using RSA Algorithm [Public-Key-Cryptography]
function generateKeys() {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: process.env.PASSPHRASE,
      },
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
    });
    return { publicKey, privateKey };
  } catch (error) {
    console.log("utils/generateKeys", error);
  }
}

module.exports = generateKeys();
