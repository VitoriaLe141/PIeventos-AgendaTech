// ========================================
// ROTAS: AUTENTICAÇÃO (view/authRoutes.js)
//
// Define os "endereços" de login e cadastro.
// Quem faz o trabalho de verdade (conferir RA e
// senha no banco) é o arquivo controller/authController.js.
// Este arquivo só diz: "quando chegar este pedido,
// chame esta função do controller".
// ========================================


// ---------- IMPORTAÇÕES ----------
import { Router } from "express";
import * as mycontroller from "../controller/authController.js";


// ---------- CONFIGURAÇÃO ----------
// Início do endereço de todas as rotas deste arquivo
const endPoint = "/auth";

const router = Router();


// ---------- LOGIN E CADASTRO (POST) ----------
// POST /auth/login     -> confere os dados e faz o login
router.post(`${endPoint}/login`, (req, res) => { mycontroller.login(req, res); });

// POST /auth/register  -> cadastra uma nova pessoa
router.post(`${endPoint}/register`, (req, res) => { mycontroller.register(req, res); });


// ---------- EXPORTAÇÃO ----------
// Entrega estas rotas para o routes.js, que junta todas
export default router;
