import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import "colors";

import dbConnection from "./configs/database.js";
import routes from "./routes/index.js";
import dotenvConfig from "./configs/dotenv.js";
import morganConfig from "./configs/morgan.js";
import limiter from "./middlewares/limiter.js";
import server from "./configs/server.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/error.Middleware.js";

dotenvConfig();
dbConnection();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "uploads")));
morganConfig(app);

app.use("/api", limiter);

app.use("/api/v1", routes);

app.all("*", (req, res, next) => {
  next(new ApiError(`can not find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);

server(app);

process.on("unhandledRejection", (err) => {
  console.error(
    `${"unhandledRejection Error:".red} ${err.name} => ${err.message}}`
  );
  server.close(() => {
    console.error(`shutting down...`);
    process.exit(1);
  });
});
