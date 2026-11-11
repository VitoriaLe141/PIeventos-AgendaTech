
import { Router } from "express";
import * as mycontroller from "../controller/eventosController.js";
import validarToken from "../middlewares/authMiddleware.js";

// Define o endereço da API
const pointName = mycontroller.getTableName() || "eventos";
const endPoint = `/${pointName}`;

const router = Router();

// Consulta todos os eventos ativos
router.get(`${endPoint}`, (req, res) => {
    mycontroller.Get(req, res);
});

// Consulta os eventos do professor autenticado
// Esta rota precisa ficar antes da rota /:id
router.get(
    `${endPoint}/professor/meus`,
    validarToken,
    (req, res) => {
        mycontroller.GetByProfessor(req, res);
    }
);

// Consulta um evento pelo ID
router.get(`${endPoint}/:id`, (req, res) => {
    mycontroller.GetById(req, res);
});

// Cadastra um novo evento
router.post(`${endPoint}`, validarToken, (req, res) => {
    mycontroller.Post(req, res);
});

// Atualiza um evento
router.put(`${endPoint}/:id`, validarToken, (req, res) => {
    mycontroller.Update(req, res);
});

// Exclui um evento
router.delete(`${endPoint}/:id`, validarToken, (req, res) => {
    mycontroller.Delete(req, res);
});

export default router;
