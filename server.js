const express = require('express');
const userRouter = require('./users/userRouter.js');
const users = require('./users/userDb');
const server = express();

server.use(express.json());
server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const time = Date.now()
  console.log(`you made a ${method} request to ${url} at ${time}`);
  next();
};

server.use('/users', userRouter);
module.exports = server;
