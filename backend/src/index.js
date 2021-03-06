//import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const path = require("path");
const PORT = process.env.PORT || 8081;

// define the Express app
const app = express();

// the database
const questions = [
  {
    id: 1,
    title: "Why?",
    description: "Bakit? Por que?",
    answers: []
  },
  {
    id: 2,
    title: "Sino?",
    description: "Who? Quien?",
    answers: []
  }
];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan("combined"));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://theclcode.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "OYUdtZYPSdUH4I67QEvKC4CPWo5HiqVg",
  issuer: `https://theclcode.auth0.com/`,
  algorithms: ["RS256"]
});

// Serve any static files
app.use(express.static(path.join(__dirname, "../../build")));

// retrieve all questions
app.get("/api/questions/getall", (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length
  }));
  res.send(qs);
});

// get a specific question
app.get("/api/questions/:id", (req, res) => {
  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();
  res.send(question[0]);
});



// // insert a new question
app.post("/api/questions/submit", (req, res) => {
  const { title, description } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: []
  };
  questions.push(newQuestion);
  res.status(200).send();
});

// insert a new answer to a question
app.post("/api/answer/:id", (req, res) => {
  const { answer } = req.body;

  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();

  question[0].answers.push({
    answer
  });

  res.status(200).send();
});

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

// start the server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
