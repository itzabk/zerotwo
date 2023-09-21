const crypto = require("crypto");

const generateStrongPassword = () => {
  try {
    const diceArray = [1, 2, 3, 4, 5, 6];
    const diceRoll = diceArray[Math.floor(Math.random() * 4)];
    const minLength = 8;
    const length = Math.floor(minLength * diceRoll);
    const temp = crypto.randomBytes(length).toString("hex");
    const validity = ["@1Aa", "@$!%xB", "@0mC"];
    const randomLength = Math.floor(Math.random() * temp.length - 2);
    return (
      temp.slice(0, randomLength) +
      validity[Math.floor(Math.random() * 3)] +
      temp.slice(randomLength)
    );
  } catch (error) {
    console.log("utils/generateStrongPassword", error.message);
  }
};

module.exports = generateStrongPassword;
