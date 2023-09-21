const redisClient = require("./redisConfig");

const redisConnect = async () => {
  await redisClient.connect();
};

module.exports = redisConnect;
