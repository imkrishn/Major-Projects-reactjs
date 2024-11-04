const express = require('express')
const app = express()
const cors = require("cors")

const userRoutes = require("./src/routes/route");
const createTable = require('./src/models/model')
createTable()

const PORT = 8000




//middlewares
app.use(cors())
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.json());

//routes

app.use("/", userRoutes)





app.listen(PORT)