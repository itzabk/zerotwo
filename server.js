//EXPRESS APP REQUIREMENT MODULES & FUNCTIONALITIES

require("dotenv").config(); //config dotenv
require("./config/dbConnect")(); //config mongo
require("ejs"); //use ejs template engine

//CONFIGURE PORT
const PORT = process.env.PORT || 3000;

//3rd PARTY NODE MODULES
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const redisClient = require("./config/redisConfig");

//BUILT IN NODE MODULES
const https = require("https");
const fs = require("fs");
const path = require("path");
const redisConnect = require("./config/redisConnect"); //connect to redis
//CUSTOM MODULES
const reqLogger = require("./middleware/reqLogger");
const mongoErrLogger = require("./middleware/mongoErrLogger");
const writeKeys = require("./utils/writeKeys");
const defaultErrorHandler = require("./controller/errorController/errorController");

//UNCAUGHT EXCEPTION HANDLER
process.on("uncaughtException", (error) => {
  console.log(
    `Name: ${error.name} =>  Message:${error.message} ${error.stack}`
  );
  process.exit(1);
});

//GLOBAL EXPRESS INSTANCE
const app = express();

//SET VIEW ENGINE, VIEWS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

//LOAD STATICC ASSETS
app.use(
  "/users/reset-password/:uid/:linkid",
  express.static(path.join(__dirname, "public"))
);

app.use(helmet()); //enforce server security
app.use(express.json({ limit: "800kb" })); //handle json data
app.use(express.urlencoded({ extended: "true", limit: "3mb" })); //handle url data
app.use(cookieParser()); //handle cookie data
app.use(cors(corsOptions)); //handle cross-origin requests

//REQUEST LOGGER [DEV ENV]
if (process.env.NODE_ENV === "dev") {
  app.use(reqLogger); //custom request middleware
  app.use(morgan("dev")); //3rd-party morgan middleware
}
//CRON-JOBS
cron.schedule("0 42 14 21 * *", () => {
  writeKeys("REFRESH"); //create refresh keys [public-private] every month
  writeKeys("ACCESS"); //create access keys [public-private] every month
});

//API ENDPOINTS
app.use("/users", require("./routes/userAuthRoutes"));
app.use("/brands", require("./routes/brandRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));
app.use("/subcategories", require("./routes/subCategoryRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/accounts", require("./routes/accountRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

//DEFAULT PAGE
app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ message: "Page you are looking is not found" });
  } else if (req.accepts("text/plain")) {
    res.status(404).send("Page you are looking is not found");
  }
});

//CUSTOM EXPRESS ERROR HANDLER
app.use(defaultErrorHandler);

//CREATE HTTPS SERVER INSTANCE
const server = https.createServer(
  {
    cert: fs.readFileSync(path.join(__dirname, "keyGens", "cert.pem"), "utf-8"),
    key: fs.readFileSync(path.join(__dirname, "keyGens", "key.pem"), "utf-8"),
  },
  app
);

//RUN DB & SERVER INSTANCE
mongoose.connection.once("open", () => {
  server.listen(PORT, () => {
    console.log(`Server is Up & Running on Port: https://127.0.0.1:${PORT}`);
    redisConnect();
  });
});

//HANDLE MONGOOSE ERROR
mongoose.connection.on("error", (err) => {
  mongoErrLogger(err);
});

//HANDLE REDIS ERROR AND SUCCESS
redisClient.on("connect", () => {
  console.log(`Connected to Redis Successfully`);
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

//UNHANDLED REJECTIONS HANDLER
process.on("unhandledRejection", (error) => {
  console.log(`Name: ${error.name} =>  Message:${error.message}`);
  server.close();
  process.exit(1);
});
