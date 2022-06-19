require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const host = "127.0.0.1";
const db = require("./models/db.js");

app.use(cors());
app.use(express.json());

const route_user = require("./routes/user.route.js");
const route_search = require("./routes/search.route.js");

app.use('/user', route_user);
app.use('/search', route_search);

app.get("*", function(req, res) {
    res.status(404).json({ message: "Esta rota não esta definida!" });
});
app.set("port", PORT)
app.listen(process.env.PORT, () => {
    console.log(`App listening at http://${host}:${PORT}/`)
})