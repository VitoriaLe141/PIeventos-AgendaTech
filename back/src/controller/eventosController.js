
import * as myModel from "../model/eventosModel.js";

// Retorna o nome da tabela
export function getTableName() {
    return myModel.tableName;
}

// Consulta todos os eventos ativos
export async function Get(req, res) {
    try {
        const response = await myModel.Get();

        if (response.message === "Success") {
            return res.status(200).json(response);
        }

        return res.status(400).json(response);

    } catch (error) {
        return res.status(500).json({
            message: "erro",
            Error: error.message
        });
    }
}

// Consulta um evento pelo ID
export async function GetById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        const response = await myModel.GetById(id);

        if (response.message === "Success") {
            return res.status(200).json(response);
        }

        return res.status(400).json(response);

    } catch (error) {
        return res.status(500).json({
            message: "erro",
            Error: error.message
        });
    }
}

// Consulta os eventos do professor autenticado
export async function GetByProfessor(req, res) {
    try {
        if (req.userRole !== "professor") {
            return res.status(403).json({
                message: "Apenas professores podem acessar esta página."
            });
        }

        const response = await myModel.GetByProfessor(req.userId);

        if (response.message === "Success") {
            return res.status(200).json(response);
        }

        return res.status(400).json(response);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar seus eventos.",
            Error: error.message
        });
    }
}

// Cadastra um novo evento
export async function Post(req, res) {
    try {
        if (req.userRole !== "professor") {
            return res.status(403).json({
                message: "Apenas professores podem cadastrar eventos."
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Nenhum dado foi enviado."
            });
        }

        // O ID vem do token, não do formulário
        const dataBody = {
            ...req.body,
            idprofessor: req.userId
        };

        const response = await myModel.Post(dataBody);

        if (response.message === "Success") {
            return res.status(201).json(response);
        }

        return res.status(400).json(response);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Erro ao cadastrar evento.",
            Error: error.message
        });
    }
}

// Exclui (desativa) um evento
export async function Delete(req, res) {
    try {
        if (req.userRole !== "professor") {
            return res.status(403).json({
                message: "Apenas professores podem excluir eventos."
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID do evento inválido."
            });
        }

        const response = await myModel.Delete(id, req.userId);

        if (response.message !== "Success") {
            return res.status(400).json(response);
        }

        if (!response.data.affectedRows) {
            return res.status(404).json({
                message: "Evento não encontrado ou não pertence a este professor."
            });
        }

        return res.status(200).json({
            message: "Evento excluído com sucesso!"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Erro ao excluir evento.",
            Error: error.message
        });
    }
}

// Atualiza um evento
export async function Update(req, res) {
    try {
        // Apenas professores podem editar eventos
        if (req.userRole !== "professor") {
            return res.status(403).json({
                message: "Apenas professores podem editar eventos."
            });
        }

        const id = Number(req.params.id);
        const data = req.body;

        // Verifica se o ID é válido
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID do evento inválido."
            });
        }

        // Verifica se todos os campos foram enviados
        if (
            !data ||
            !data.titulo?.trim() ||
            !data.descricao?.trim() ||
            !data.categoria?.trim() ||
            !data.data ||
            !data.horario ||
            !data.local?.trim() ||
            !Number.isInteger(Number(data.vagas)) ||
            Number(data.vagas) <= 0
        ) {
            return res.status(400).json({
                message: "Preencha corretamente todos os campos."
            });
        }

        // Organiza os dados recebidos
        const dadosAtualizados = {
            titulo: data.titulo.trim(),
            descricao: data.descricao.trim(),
            categoria: data.categoria.trim(),
            data: data.data,
            horario: data.horario,
            local: data.local.trim(),
            vagas: Number(data.vagas)
        };

        const response = await myModel.Update(
            id,
            req.userId,
            dadosAtualizados
        );

        if (response.message !== "Success") {
            return res.status(400).json(response);
        }

        if (!response.data.affectedRows) {
            return res.status(404).json({
                message: "Evento não encontrado ou não pertence a este professor."
            });
        }

        return res.status(200).json({
            message: "Evento atualizado com sucesso!"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Erro ao atualizar evento.",
            Error: error.message
        });
    }
}
