/* ==========================================
   CONTROLLER: INSCRIÇÕES
   Recebe as requisições de inscrições e verifica
   os dados e o perfil do usuário conectado.
   ========================================== */

import * as myModel from "../model/inscricoesModel.js";

// Retorna o nome da tabela para montar as rotas
export function getTableName() {
    return myModel.tableName;
}

// Lista as inscrições do aluno autenticado
export async function GetByAluno(req, res) {
    try {
        // Somente alunos podem consultar suas próprias inscrições
        if (req.userRole !== "aluno") {
            return res.status(403).json({
                message: "Apenas alunos podem consultar suas inscrições."
            });
        }

        const response = await myModel.GetByAluno(req.userId);

        if (response.message === "Success") {
            return res.status(200).json(response);
        }

        return res.status(400).json(response);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar suas inscrições.",
            Error: error.message
        });
    }
}

// Lista os alunos inscritos nos eventos do professor autenticado
export async function GetByProfessor(req, res) {
    try {
        // Impede que alunos acessem a lista de inscritos dos professores
        if (req.userRole !== "professor") {
            return res.status(403).json({
                message: "Apenas professores podem consultar os inscritos."
            });
        }

        const response = await myModel.GetByProfessor(req.userId);

        if (response.message === "Success") {
            return res.status(200).json(response);
        }

        return res.status(400).json(response);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar os alunos inscritos.",
            Error: error.message
        });
    }
}

// Cadastra uma inscrição para o aluno que está conectado
export async function Post(req, res) {
    try {
        // Somente alunos podem se inscrever em eventos
        if (req.userRole !== "aluno") {
            return res.status(403).json({
                message: "Apenas alunos podem se inscrever em eventos."
            });
        }

        // Confere se o ID recebido na URL é válido
        const idevento = Number(req.params.idevento);

        if (!Number.isInteger(idevento) || idevento <= 0) {
            return res.status(400).json({
                message: "ID do evento inválido."
            });
        }

        // Usa o ID do token para não confiar em dados enviados pelo navegador
        const response = await myModel.Post(idevento, req.userId);

        if (response.message === "Success") {
            return res.status(201).json({
                message: "Inscrição realizada com sucesso!"
            });
        }

        return res.status(400).json(response);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao realizar inscrição.",
            Error: error.message
        });
    }
}

// Cancela uma inscrição do aluno autenticado
export async function Delete(req, res) {
    try {
        // Somente alunos podem cancelar suas inscrições
        if (req.userRole !== "aluno") {
            return res.status(403).json({
                message: "Apenas alunos podem cancelar inscrições."
            });
        }

        // Confere se o ID recebido na URL é válido
        const idevento = Number(req.params.idevento);

        if (!Number.isInteger(idevento) || idevento <= 0) {
            return res.status(400).json({
                message: "ID do evento inválido."
            });
        }

        const response = await myModel.Delete(idevento, req.userId);

        if (response.message !== "Success") {
            return res.status(400).json(response);
        }

        // Verifica se alguma inscrição foi realmente removida
        if (!response.data.affectedRows) {
            return res.status(404).json({
                message: "Inscrição não encontrada."
            });
        }

        return res.status(200).json({
            message: "Inscrição cancelada com sucesso!"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao cancelar inscrição.",
            Error: error.message
        });
    }
}
