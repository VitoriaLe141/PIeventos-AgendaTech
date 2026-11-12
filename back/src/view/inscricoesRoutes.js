/* ==========================================
   ROTAS: INSCRIÇÕES
   Define os endereços usados pelos alunos e
   professores para trabalhar com inscrições.
   ========================================== */

import { Router } from "express";
import * as mycontroller from "../controller/inscricoesController.js";
import validarToken from "../middlewares/authMiddleware.js";

// Define o endereço principal das inscrições
const endPoint = `/${mycontroller.getTableName()}`;

const router = Router();

// Consulta as inscrições do aluno conectado
router.get(`${endPoint}/minhas`, validarToken, (req, res) => {
    mycontroller.GetByAluno(req, res);
});

// Consulta os alunos inscritos nos eventos do professor conectado
router.get(`${endPoint}/professor/meus`, validarToken, (req, res) => {
    mycontroller.GetByProfessor(req, res);
});

// Realiza a inscrição do aluno em um evento
router.post(`${endPoint}/:idevento`, validarToken, (req, res) => {
    mycontroller.Post(req, res);
});

// Cancela a inscrição do aluno em um evento
router.delete(`${endPoint}/:idevento`, validarToken, (req, res) => {
    mycontroller.Delete(req, res);
});

export default router;
