require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const articleRouter = require("./routes/articles");
const Article = require("./models/article");

const cluster = "cluster0.frqsy";
const dbname = "blog";

mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
// mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connect("mongodb://localhost/blog", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);
app.listen(process.env.PORT, () => {
  console.log("Server is running at port " + process.env.PORT);
});
