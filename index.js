const server = require("./server.js");

const port = process.env.PORT || 4000;
const greeting = "Hi, Phil!";
server.listen(port, () => {
  console.log(
    `\n*** ${greeting} Server Running on http://localhost:${port} ***\n`
  );
});