import dotenv from "dotenv";

const dotenvConfig = () =>
  dotenv.config({
    path: "config.env",
  });

export default dotenvConfig;
