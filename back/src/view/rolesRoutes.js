// ========================================
// ROTAS: AUTH
// ========================================


import { Router } from "express";
import * as mycontroller from "../controller/rolesController.js";


// O caminho é montado com o nome da tabela (ex: /roles)
const pointName = mycontroller.getTableName() || "roles";
const endPoint = `/${pointName}`;

const router = Router();


// Consultas
router.get(endPoint, (req, res) => { mycontroller.Get(req, res); });
// Consulta os registros disponíveis.
router.get(`${endPoint}/:id`, (req, res) => { mycontroller.GetById(req, res); });
// Consulta os registros disponíveis.
router.get(`${endPoint}/email/:email`, (req, res) => { mycontroller.GetByEmail(req, res); });

// Cadastro, alteração e exclusão
router.post(endPoint, (req, res) => { mycontroller.Post(req, res); });
// Envia os dados para atualizar um registro.
router.put(`${endPoint}/:id`, (req, res) => { mycontroller.Put(req, res); });
// Remove ou desativa o registro indicado.
router.delete(`${endPoint}/:id`, (req, res) => { mycontroller.Delete(req, res); });


export default router;
