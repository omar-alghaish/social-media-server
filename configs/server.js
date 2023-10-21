import "colors";

const server = (app) => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, (err) => {
    console.log(`App running on port: ${PORT.green}`);
  });
};

export default server;
