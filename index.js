//Entrance to the application

const config = require("config");
const mongoose = require("mongoose");
const usersRoute = require("./routes/users.route");
const express = require("express");
const app = express();

// use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("Fatal ERROR: myprivatekey is not Defined!!");
  process.exit(1);
}

//connect to mongodb
mongoose
  .connect("mongodb://localhost/NodejsAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDb!"));

app.use(express.json());

//use users route for api/users

app.use("/api/users", usersRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is on in port ${port}"));
