require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');
const options = {
    all:true,
};
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(require('body-parser').urlencoded({extended: false}))
app.use(require('body-parser').json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const storage = [];
app.post("/api/shorturl", (req, res) => {
  const original_url = req.body.url;
  const parsed = url.parse(original_url);
  console.log(parsed);
  if(parsed.host===null)
    return res.json({error: 'invalid url'})
  dns.lookup(parsed.host, options, (err, addresses) => {
    if(err)
      return res.json({error: 'invalid host'})
    else{
      const short_url = storage.length;
      storage.push(parsed.href);
      res.json({original_url, short_url});
    }
  })
  console.log(storage)
})
app.get("/api/shorturl/:id", (req, res) => {
  const original_url = storage[req.params.id];
  console.log(original_url)
  res.redirect(original_url);
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
