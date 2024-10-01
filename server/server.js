const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const port = 1200;
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "client/src/components/card")));


app.use("/Employee", require("./routes/EmployeeRoutes"));
app.use("/Assessment",require("./routes/AssessmentsRoutes"))
app.use("/newskill", require("./routes/skillSetRoutes"))
app.use("/skillScore", require("./routes/skillScoreRoute"))


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });