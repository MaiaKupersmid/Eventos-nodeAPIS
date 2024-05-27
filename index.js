import express from "express";  
import cors from "cors"; 
import Router2 from "./src/controllers/listado_eventos-controller.js"
import Router4 from "./src/controllers/detalle_eventos-controller.js"
import Router6 from "./src/controllers/event_users-controller.js"
import Router7 from "./src/controllers/event_provinces-controllers.js"
import Router11 from "./src/controllers/event_locations-controller.js"
import Router12 from"./src/controllers/event_categories-controllers.js" 

const app = express(); 
const port = 3000; 

app.use(cors()); 
app.use(express.json());
app.use("/api/listado_eventos", Router2);
app.use("/api/detalle_eventos", Router4);
app.use("/api/event_users", Router6);
app.use("/api/event_provinces", Router7);
app.use("/api/event_locations", Router11);
app.use("/api/event_categories", Router12);

app.listen(port,() => { 
    console.log(`Example app listening on port ${port}`) 
})