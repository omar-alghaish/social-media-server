import mongoose from "mongoose";
import "colors";

const dbConnection = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB_URI)
    .then((connect) =>
      console.log(`connected to database: ${connect.connection.name.green}`)
    );
};

export default dbConnection;
