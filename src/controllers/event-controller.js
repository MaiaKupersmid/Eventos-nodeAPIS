import { Router } from "express";
import EventsService from "../services/event-service.js";
import AutenticationMddleware from "./../middlewares/autentication-middleware.js";
import { parse } from "dotenv";
const router = Router();
const svc = new EventsService();

const claveSecreta = "MaiuJuli_0607";

router.get("", async (req, res) => {
  let respuesta;
  const filtros = req.query;
  let limit = req.query.limit;
  let offset = req.query.offset;
  if (isNaN(offset)) {
    offset = 0;
  }

  if (isNaN(limit)) {
    limit = 99999999;
  }
  const usarInicio = await svc.getByFilter(filtros, limit, offset);
  if (usarInicio != null) {
    respuesta = res.status(200).json(usarInicio);
  } else {
    respuesta = res.status(401).send("NoOk");
  }
  return respuesta;
});

router.get("/:id", async (req, res) => {
  let respuesta;
  let id = req.params.id;
  const event_detalle = await svc.getByIdAsync(id);
  if (event_detalle != null) {
    respuesta = res.status(200).json(event_detalle);
  } else {
    respuesta = res.status(404).send(`Not found.`);
  }
  return respuesta;
});

router.post("", AutenticationMddleware.AuthMiddleware, async (req, res) => {
  let respuesta;
  let newEve = req.body;
  const eve = await svc.createAsync(newEve);
  if (eve != null) {
    respuesta = res.status(201).json("created");
  } else {
    respuesta = res.status(400).send(`Bad request.`);
  }
  return respuesta;
});

router.put("", AutenticationMddleware.AuthMiddleware, async (req, res) => {
  let respuesta;
  let newEve = req.body;
  const eve = await svc.updateAsync(newEve);
  if (eve != null) {
    respuesta = res.status(201).json("Succesfully");
  } else {
    respuesta = res.status(400).send(`Error interno.`);
  }
  return respuesta;
});

router.delete(
  "/:id",
  AutenticationMddleware.AuthMiddleware,
  async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const eve = await svc.deleteByIdAsync(id);
    if (eve != 0) {
      respuesta = res.status(200).json("Eliminada");
    } else {
      respuesta = res.status(404).send(`Not Found.`);
    }
    return respuesta;
  }
);

router.post(
  "/:id/enrollment",
  AutenticationMddleware.AuthMiddleware,
  async (req, res) => {
    let idEvento = req.params.id;
    let idUsuario = req.id_user;
    let respuesta = null;
    const event_detalle = await svc.getByIdAsync(idEvento);
    if (event_detalle != null) {
      const startDate = new Date(event_detalle[0].start_date);
      const currentDate = new Date();

      if ((startDate) => currentDate) {
        if (event_detalle[0].enabled_for_enrollment == "1") {
          const cantidadinscriptos = await svc.getEnrollmentAsync(idEvento);

          if (cantidadinscriptos.cantidad < event_detalle[0].max_assistance) {
            const enr = await svc.createEnrollmentAsync(
              idUsuario,
              idEvento,
              currentDate
            );

            if (enr != 0) {
              respuesta = res.status(201).json("Created");
            } else {
              respuesta = res.status(400).send(`Bad Request.`);
            }
          } else {
            respuesta = res
              .status(400)
              .send(`Exceda la capacidad máxima de registrados`);
          }
        } else {
          respuesta = res
            .status(400)
            .send(`No está habilitado para la inscripción`);
        }
      } else {
        respuesta = res.status(400).send(`El evento ya sucedio!`);
      }
    } else {
      respuesta = res.status(404).send(`El evento no existe!`);
    }
    return respuesta;
  }
);

router.delete("/:id/enrollment",
  AutenticationMddleware.AuthMiddleware,
  async (req, res) => {
    let idEvento = req.params.id;
    let idUsuario = req.id_user;
    let respuesta = null;
    const event_detalle = await svc.getByIdAsync(idEvento);

    if (event_detalle != null) {
      const startDate = new Date(event_detalle[0].start_date);
      const currentDate = new Date();

      if ((startDate) => currentDate) {
          const enr = await svc.deleteEnrollmentAsync(
              idUsuario,
              idEvento,
            );
            if (enr != 0) {
              respuesta = res.status(200).json("Te desuscribiste correctamente");
            } else {
              respuesta = res.status(400).send(`No se encontro tu suscripcion.`);
            }
      } else {
        respuesta = res.status(400).send(`El evento ya sucedio!`);
      }
    } else {
      respuesta = res.status(404).send(`El evento no existe!`);
    }
    return respuesta;
});

router.get("/:id/enrollment", async (req, res) => {
  let respuesta;
  const filtros = req.query;
  let idEvento = req.params.id;
  let limit = req.query.limit;
  let offset = req.query.offset;
  if (isNaN(offset)) {
    offset = 0;
  }

  if (isNaN(limit)) {
    limit = 99999999;
  }
  const usersEnrollments = await svc.getEnrollmentByFilterAsync(filtros, limit, offset, idEvento);
  if (usersEnrollments != null) {
    respuesta = res.status(200).json(usersEnrollments);
  } else {
    respuesta = res.status(401).send("No se encontro tu busqueda");
  }
  return respuesta;
});

router.patch("/:id/enrollment/:rating",
AutenticationMddleware.AuthMiddleware,
async (req, res) => {
  try{

    let idEvent_enroll = req.params.id;
    let rating = parseInt(req.params.rating);
    let idUsuario = req.id_user;
    const observations = req.body.observations;
    let respuesta = null;
    
    const event_detalle = await svc.getByIdAsync(idEvent_enroll);
    if (event_detalle != null) {
      const startDate = new Date(event_detalle[0].start_date);
      const currentDate = new Date();
      if ((startDate) <= currentDate) {
        if(rating>10 || rating<1){
          respuesta = res.status(400).send(`El rating debe ser entre 1 y 10!`);
        }else{
          if (e) {
            const event_rating = await svc.patchRatingAsync(rating, idEvent_enroll, idUsuario);
            respuesta = res.status(200).json("Rankeada correctamente");
          } else {
            respuesta = res.status(404).send(`Bad Request..`);
          }
        }
        
      } else {
        respuesta = res.status(400).send(`El evento no sucedio aún!`);
      }
    } else {
      respuesta = res.status(404).send(`El evento no existe!`);
    }  
  } catch(error){
    return res.status(404).send("not found");
  }
  });
  
  export default router;
