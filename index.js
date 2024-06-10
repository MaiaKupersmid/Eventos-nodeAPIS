import express from "express";  
import cors from "cors"; 
import Router2 from "./src/controllers/listado_eventos-controller.js"
import Router4 from "./src/controllers/detalle_eventos-controller.js"
import Router6 from "./src/controllers/event_users-controller.js"
import Router7 from "./src/controllers/event_provinces-controllers.js"
import Router8 from "./src/controllers/CEE_eventos-controller.js"
import Router11 from "./src/controllers/event_locations-controller.js"
import Router12 from"./src/controllers/event_categories-controllers.js" 

const app = express(); 
const port = 3000; 

app.use(cors()); 
app.use(express.json());
app.use("/api/listado_eventos", Router2);
// app.use("/api/buscar_eventos", Router3);
app.use("/api/detalle_eventos", Router4);
// app.use("/api/listado_users", Router5);
app.use("/api/event_users", Router6);
app.use("/api/event_provinces", Router7);
app.use("/api/CEE_eventos", Router8);
// app.use("/api/inscripcion_eventos", Router9);
// app.use("/api/rating_eventos", Router10);
app.use("/api/event_locations", Router11);
app.use("/api/event_categories", Router12);
// app.use("/api/ubicaciones_eventos", Router13);

app.listen(port,() => { 
    console.log(`Example app listening on port ${port}`) 
})