const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors({
  origin: "*",
  credentials: true
}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/api/nodeflux/authorization', (req, res) => {
  request({
    url: "https://backend.cloud.nodeflux.io/auth/signatures",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    json: {
      "access_key": req.body.access_key, // CHANGE TO BODY
      "secret_key": req.body.secret_key
    }
  }, (error, response, body) => {
    // console.log(JSON.parse(JSON.stringify(response)))
    let jjson = JSON.parse(JSON.stringify(response))
    return res.status(jjson.statusCode).json(body)
  })
});

app.post('/api/nodeflux/face-match', (req, res) => {
  request({
    url: "https://api.cloud.nodeflux.io/v1/analytics/face-match",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": req.headers.authorization,
      "x-nodeflux-timestamp": req.headers['x-nodeflux-timestamp']
    },
    json: {
      "additional_params": {
        "similarity_threshold": req.body.additional_params.similarity_threshold,
        "auto_orientation": req.body.additional_params.auto_orientation
      },
      "images": [req.body.images[0], req.body.images[1]]
    }
  }, (error, response, body) => {
    let jjson = JSON.parse(JSON.stringify(response))
    return res.status(jjson.statusCode).json(body)
  })
});

app.listen(port, () => console.log(`listening on ${port}`));