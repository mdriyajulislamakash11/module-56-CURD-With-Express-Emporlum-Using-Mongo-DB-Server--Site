const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// madleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("coffee meacking server is running....");
});

app.listen(port, () => {
    console.log(`Coffee server is Running on port: ${port}`)
});
