import express from 'express';

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

// Needed to read JSON bodies in POST/PUT
app.use(express.json());

// Set Pug as template engine
app.set('view engine', 'pug');
app.set('views', './src/views');

// Root page using Pug
app.get('/', (req, res) => {
  const values = {
    title: 'My REST API',
    message: 'Welcome to my Express + Pug API!'
  };
  res.render('index', values);
});

// Start server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
