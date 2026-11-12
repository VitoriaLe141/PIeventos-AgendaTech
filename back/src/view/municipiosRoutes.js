// ========================================
// ROTAS: MUNICÍPIOS (view/municipiosRoutes.js)
//
// Define os "endereços" da API para municípios.
// Quem faz o trabalho de verdade (conversar com o banco)
// é o arquivo controller/municipiosController.js.
// Este arquivo só diz: "quando chegar este pedido,
// chame esta função do controller".
// ========================================


// ---------- IMPORTAÇÕES ----------
import { Router } from "express";
import * as mycontroller from "../controller/municipiosController.js";


// ---------- CONFIGURAÇÃO ----------
// Início do endereço de todas as rotas deste arquivo
const endPoint = "/municipios";

const router = Router();


// ---------- CONSULTAS (GET) ----------
// GET /municipios      -> lista todos os municípios
router.get(endPoint, (req, res) => { mycontroller.Get(req, res); });

// GET /municipios/:id  -> busca um município pelo id
router.get(`${endPoint}/:id`, (req, res) => { mycontroller.GetById(req, res); });


// ---------- CADASTRO, ALTERAÇÃO E EXCLUSÃO ----------
// POST /municipios      -> cadastra um novo município
router.post(endPoint, (req, res) => { mycontroller.Post(req, res); });

// PUT /municipios/:id    -> altera um município existente
router.put(`${endPoint}/:id`, (req, res) => { mycontroller.Put(req, res); });

// DELETE /municipios/:id -> apaga um município
router.delete(`${endPoint}/:id`, (req, res) => { mycontroller.Delete(req, res); });


// ---------- EXPORTAÇÃO ----------
// Entrega estas rotas para o routes.js, que junta todas
export default router;
