// ========================================
// ROTAS PRINCIPAIS (view/routes.js)
//
// Este arquivo é o "recepcionista" das rotas.
// Ele não cria rotas, só junta os outros
// arquivos de rotas num lugar só.
// O server.js usa este arquivo com:
//   app.use(swRoutes)
// ========================================


// ---------- IMPORTAÇÕES ----------
import { Router } from "express";

// Cada import abaixo traz um arquivo de rotas da pasta view
import userRoutes from "./usersRoutes.js";              // rotas de usuários
import clientes from "./clientesRoutes.js";             // rotas de clientes
import alunosRoles from "./alunosRoutes.js";            // rotas de alunos
import authRoutes from "./authRoutes.js";               // rotas "auth" (hoje, na verdade, são de roles)
import municipiosRoutes from "./municipiosRoutes.js";   // rotas de municípios
import estadosRoutes from "./estadosRoutes.js";         // rotas de estados
import dependenciasRoutes from "./dependenciaRoutes.js"; // rotas de dependências
import rolesRoutes from "./rolesRoutes.js";             // rotas de roles (perfis)
import usersRoles from "./usersRolesRoutes.js";         // liga usuários aos seus perfis
import eventosRoutes from "./eventosRoutes.js";         // rotas de eventos


// ---------- CRIAÇÃO DO ROTEADOR ----------
// O Router é uma "caixa" onde a gente junta as rotas
const swRoutes = Router();


// ---------- REGISTRO DAS ROTAS ----------
// O Express lê de cima pra baixo. Se dois arquivos tiverem o
// mesmo caminho, vale o que aparecer primeiro.

// Usuários, clientes, alunos e autenticação
swRoutes.use(userRoutes);
swRoutes.use(clientes);
swRoutes.use(alunosRoles);
swRoutes.use(authRoutes);

// Localização, dependências e perfis
swRoutes.use(municipiosRoutes);
swRoutes.use(estadosRoutes);
swRoutes.use(dependenciasRoutes);
swRoutes.use(rolesRoutes);
swRoutes.use(usersRoles);
swRoutes.use(eventosRoutes); 


// ---------- EXPORTAÇÃO ----------
// Disponibiliza o roteador para o server.js usar
export default swRoutes;