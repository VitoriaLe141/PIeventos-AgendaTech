// ========================================
// ROTAS: DEPENDÊNCIAS (view/dependenciaRoutes.js)
//
// Define os "endereços" da API para dependências.
// Quem conversa com o banco de verdade é o
// arquivo controller/dependeciaController.js.
// Este arquivo só diz: "quando chegar este pedido,
// chame esta função do controller".
// ========================================


// ---------- IMPORTAÇÕES ----------
import { Router } from "express";
import * as mycontroller from "../controller/dependeciaController.js";


// ---------- CONFIGURAÇÃO ----------
// Início do endereço de todas as rotas deste arquivo
const endPoint = "/dependencias";

const router = Router();


// ---------- CONSULTAS (GET) ----------
// GET /dependencias      -> lista todas as dependências
router.get(endPoint, (req, res) => { mycontroller.Get(req, res); });

// GET /dependencias/:id  -> busca uma dependência pelo id
router.get(`${endPoint}/:id`, (req, res) => { mycontroller.GetById(req, res); });


// ---------- CADASTRO, ALTERAÇÃO E EXCLUSÃO ----------
// POST /dependencias      -> cadastra uma nova dependência
router.post(endPoint, (req, res) => { mycontroller.Post(req, res); });

// PUT /dependencias/:id    -> altera uma dependência existente
router.put(`${endPoint}/:id`, (req, res) => { mycontroller.Put(req, res); });

// DELETE /dependencias/:id -> apaga uma dependência
router.delete(`${endPoint}/:id`, (req, res) => { mycontroller.Delete(req, res); });


// ---------- EXPORTAÇÃO ----------
// Entrega estas rotas para o routes.js, que junta todas
export default router;
