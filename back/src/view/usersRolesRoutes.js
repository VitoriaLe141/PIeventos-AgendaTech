/* ==========================================
   ROTAS: PERFIS DOS USUÁRIOS
   Define os endereços da API que relacionam usuários
   aos seus perfis de acesso.
   ========================================== */

import { Router } from "express";
import * as mycontroller from "../controller/usersRolerController.js"

const pointName = mycontroller.getTableName() || 'users';

const endPoint = `/${pointName}`;

const router = Router();

// Lista as relações entre usuários e perfis.
router.get( `${endPoint}`, (req,res)=>{ mycontroller.Get(req,res) });
// Busca uma relação pelo ID.
router.get( `${endPoint}/:id`, (req,res)=>{ mycontroller.GetById(req,res) });
// Busca uma relação pelo e-mail informado.
router.get( `${endPoint}/email/:email`, (req,res)=>{ mycontroller.GetByEmail(req,res) });

// Remove a relação indicada pelo ID.
router.delete( `${endPoint}/:id`, (req,res)=>{ mycontroller.Delete(req,res) });
// Cria uma relação entre usuário e perfil.
router.post(`${endPoint}`,(req,res) => { mycontroller.Post(req,res)});
// Atualiza uma relação entre usuário e perfil.
router.put(`${endPoint}/:id`, (req,res) => { mycontroller.Put(req,res)} );


export default router;
