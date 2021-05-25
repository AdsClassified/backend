const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./Routes/User-routes");
const adRoutes = require("./Routes/Ad-routes");

const PORT = process.env.PORT || 3001;

const app = express();

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

let db;
mongoose
  .connect(
    "mongodb+srv://user1:dbuser99$@cluster0.eacum.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then((client) => {
    // console.log(db);
    // console.log(client.connections[0].db);

    db = client.connections[0].db;
    app.set("db", db);
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error", err.message);
  });

// const MongoUri =
//   "mongodb+srv://user1:dbuser99$@cluster0.eacum.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongoose.connect(MongoUri, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on("connected", () => {
//   app.set("db", db);
//   console.log("connected to mongo");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("error connecting mongoose", err);
// });

// const MongoUri =
//   "mongodb+srv://user1:dbuser99$@cluster0.2bgbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongoose.connect(MongoUri, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on("connected", () => {
//   console.log("connected to mongo");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("error connecting mongoose", err);
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requseted-With, Content-Type, Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

  next();
});

// app.get("/getads", (req, res) => {
//   console.log("hello g");
// });
app.use("/api/users", usersRoutes);
app.use("/api/placead", adRoutes);
// app.post("/api/users", (req, res) => {
//   console.log(req.body);
// });

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
