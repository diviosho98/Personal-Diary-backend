const connectTodatabase = require('./database');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

connectTodatabase();

app.use(express.json());
// routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/story', require('./routes/story.js'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})