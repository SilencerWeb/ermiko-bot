const express = require('express');


const startServer = () => {
  const app = express();

  const server = app.listen(process.env.PORT, '0.0.0.0', () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Web server started at http://${host}:${port}`);
  });

  app.get('/', (request, response) => {
    response.sendStatus(200);
  });
};


module.exports = { startServer };
