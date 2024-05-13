import express from "express";  
import cors from "cors"; 
import Router from"./src/controllers/event_categories-controllers.js" 

const app = express(); 
const port = 3000; 

app.use(cors()); 
app.use(express.json());
app.use("/api/event_categories", Router);
app.listen(port,() => { 
    console.log(`Example app listening on port ${port}`) 
})