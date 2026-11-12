/* ==========================================
   ROTAS: ALUNOS
   Define os endereços da API relacionados aos alunos.
   ========================================== */

import { Router } from "express";
import * as mycontroller from "../controller/alunosController.js"

const pointName = mycontroller.getTableName() || 'alunos';

const endPoint = `/${pointName}`;

const router = Router();

// Lista os alunos cadastrados.
router.get( `${endPoint}`, (req,res)=>{ mycontroller.Get(req,res) });
// Busca um aluno pelo ID.
router.get( `${endPoint}/:id`, (req,res)=>{ mycontroller.GetById(req,res) });
// Exclui o aluno indicado pelo ID.
router.delete( `${endPoint}/:id`, (req,res)=>{ mycontroller.Delete(req,res) });
// Cadastra um novo aluno.
router.post(`${endPoint}`,(req,res) => { mycontroller.Post(req,res)});
// Atualiza os dados de um aluno.
router.put(`${endPoint}/:id`, (req,res) => { mycontroller.Put(req,res)} );
export default router;
