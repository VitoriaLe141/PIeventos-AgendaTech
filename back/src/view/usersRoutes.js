/* ==========================================
   ROTAS: USUÁRIOS
   Define os endereços da API relacionados aos usuários.
   ========================================== */

import { Router } from "express";
import * as mycontroller from "../controller/usersController.js"

const pointName = mycontroller.getTableName() || 'usersroles';

const endPoint = `/${pointName}`;

const router = Router();

// Lista os usuários cadastrados.
router.get( `${endPoint}`, (req,res)=>{ mycontroller.Get(req,res) });
// Busca um usuário pelo ID.
router.get( `${endPoint}/:id`, (req,res)=>{ mycontroller.GetById(req,res) });
// Busca um usuário pelo login ou e-mail.
router.get( `${endPoint}/email/:email`, (req,res)=>{ mycontroller.GetByEmail(req,res) });

// Exclui o usuário indicado pelo ID.
router.delete( `${endPoint}/:id`, (req,res)=>{ mycontroller.Delete(req,res) });
// Cadastra um novo usuário.
router.post(`${endPoint}`,(req,res) => { mycontroller.Post(req,res)});
// Atualiza os dados de um usuário.
router.put(`${endPoint}/:id`, (req,res) => { mycontroller.Put(req,res)} );
export default router;
