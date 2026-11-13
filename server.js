const express = require("express");
const cors = requre("cors")

const app= express();
const PORT = 3000;
//Allow the server to understand JSON data
app.use(cors());
app.use(express.json());

//Test route
app.get("/",(req, res)=>{
    res.send("Welcome to the ShopEase Backend");
});
//Health-check route
app.get("/api/health",(req, res)=>{
    res.json({
        success: true,
        message: "ShopEase backend is running!"
    });
});
//Start to server
app.listen(PORT,()=>{
    console.log(`ShopEase Backend running at http://localhost:${PORT}`);
});