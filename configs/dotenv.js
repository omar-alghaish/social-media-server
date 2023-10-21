import dotenv from "dotenv";

const dotenvConfig = () =>
  dotenv.config({
    path: ".env",
  });

export default dotenvConfig;
