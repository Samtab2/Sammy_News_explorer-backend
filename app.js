const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { errors } = require("celebrate");

const MainRouter = require("./Routes/Index");

const { requestLogger, errorLogger } = require("./Middleware/Logger");

const errorHandler = require("./Middleware/ErrorHandler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/news")
  .then(() => {
    console.log("DB connected");
  })
  .catch(console.error);

app.use(requestLogger);
app.use(express.json());
app.use(cors());

app.use("/", MainRouter);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
