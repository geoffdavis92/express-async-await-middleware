const fs = require("fs");
const express = require("express");
const fetch = require("node-fetch");
const app = express();

const asyncMiddleware = async (req, res, next) => {
  const postCount = req.params.postCount || 1;
  req.middleware = {
    data: await fetch(`https://jsonplaceholder.typicode.com/posts`)
      .then(res => res.json())
      .then(
        json =>
          json.length && json.length > 0
            ? json.splice(0, postCount)
            : json.splice(0, 1)
      )
  };
  next();
};

app.get("/", (req, res) => {
  res.send(fs.readFileSync("index.html", { encoding: "utf8" }));
});

app.get("/posts/?", (req, res) => {
  res.redirect("/");
});

app.get("/posts/:postCount", asyncMiddleware, (req, res) => {
  const { data } = req.middleware;
  res.json(data);
});

app.listen(process.env.PORT || 2017, () =>
  console.log(`\nServing application on port ${process.env.PORT || 2017}\n`)
);
