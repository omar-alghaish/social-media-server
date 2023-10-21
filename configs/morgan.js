import morgan from "morgan";
import "colors";

const morganConfig = (app) => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV.green}`);
  }
  if (process.env.NODE_ENV === "production") {
    console.log(`mode: ${process.env.NODE_ENV.green}`);
  }
};

export default morganConfig;
