const whitelist = [
  `https://127.0.0.1:${process.env.PORT}/*`,
  `https://localhost:${process.env.PORT}/*`,
  `https://127.0.0.1:3000/*`,
  `https://localhost:3000/*`,
  "http://localhost:3000",
  "http://localhost:3000/*",
];

module.exports = whitelist;
