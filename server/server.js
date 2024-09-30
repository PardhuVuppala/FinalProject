const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const port = 1200;





app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });