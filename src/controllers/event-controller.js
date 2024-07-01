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
  if(limit != null && offset != null)
  {
    limit = parseInt(limit);
    offset = parseInt(offset);
    if (isNaN(limit) && isNaN(offset)) {
    console.log("error");
        res.status(500).send("no es un numero");
      } else {
        const usarInicio = await svc.getByFilter(filtros, limit, offset);
            if (usarInicio != null) {
                respuesta = res.status(200).json(usarInicio);
            } else {
                respuesta = res.status(401).send("NoOk");
            }
      }
  } else {
    const usarInicio = await svc.getByFilter(filtros, limit, offset);
        if (usarInicio != null) {
            respuesta = res.status(200).json(usarInicio);
        } else {
            respuesta = res.status(401).send("NoOk");
        }
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
    console.log(eve);
    if (eve != null) {
      respuesta = res.status(200).json("Eliminada");
    } else {
      respuesta = res.status(404).send(`Not Found.`);
    }
    return respuesta;
  }
);

export default router;
