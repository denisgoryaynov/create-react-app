const path = require('path');

//node_modules dependencies
const express = require('express');

//custom dependencies

const app = express();

const port = process.argv[2] || 3000;

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'HEAD');
  next();
});

app.head('/', (req, res) => {
  res.sendStatus(200);
});

app.use(
  'static',
  express.static(path.join(__dirname, 'static'), { maxAge: 604800 * 1000 })
);

app.get('*', (req, res) => {});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
