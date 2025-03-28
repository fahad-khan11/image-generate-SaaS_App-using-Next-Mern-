const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv")
const app = express();
const connectDB = require('./db/db')


app.use(express.json());
app.use(cors());
dotenv.config()
const PORT = process.env.PORT || 3000;
connectDB()

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server is runing on the http://localhost:${PORT}`);
    
})