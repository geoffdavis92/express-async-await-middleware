const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", "./");

const fetchPosts = async (req, res, next) => {
  const postCount = req.params.postCount || 1;
  req.data = await fetch(`https://jsonplaceholder.typicode.com/posts`)
    .then(res => res.json())
    .then(
      json =>
        json.length && json.length > 0
          ? json.splice(0, postCount)
          : json.splice(0, 1)
    );
  next();
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/posts/?", (req, res) => {
  res.redirect("/");
});

app.get("/posts/:postCount", fetchPosts, ({ data }, res) => {
  res.render("post", { data });
});

app.listen(process.env.PORT || 2017, () =>
  console.log(`\nServing application on port ${process.env.PORT || 2017}\n`)
);
