// ========================================
// ROTAS: ESTADOS (view/estadosRoutes.js)
//
// Define os "endereços" da API para estados.
// Quem conversa com o banco de verdade é o
// arquivo controller/estadosController.js.
// Este arquivo só diz: "quando chegar este pedido,
// chame esta função do controller".
// ========================================


// ---------- IMPORTAÇÕES ----------
import { Router } from "express";
import * as mycontroller from "../controller/estadosController.js";


// ---------- CONFIGURAÇÃO ----------
// Início do endereço de todas as rotas deste arquivo
const endPoint = "/estados";

const router = Router();


// ---------- CONSULTAS (GET) ----------
// GET /estados      -> lista todos os estados
router.get(endPoint, (req, res) => { mycontroller.Get(req, res); });

// GET /estados/:id  -> busca um estado pelo id
router.get(`${endPoint}/:id`, (req, res) => { mycontroller.GetById(req, res); });


// ---------- CADASTRO, ALTERAÇÃO E EXCLUSÃO ----------
// POST /estados      -> cadastra um novo estado
router.post(endPoint, (req, res) => { mycontroller.Post(req, res); });

// PUT /estados/:id    -> altera um estado existente
router.put(`${endPoint}/:id`, (req, res) => { mycontroller.Put(req, res); });

// DELETE /estados/:id -> apaga um estado
router.delete(`${endPoint}/:id`, (req, res) => { mycontroller.Delete(req, res); });


// ---------- EXPORTAÇÃO ----------
// Entrega estas rotas para o routes.js, que junta todas
export default router;
