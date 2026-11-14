
import { db } from "../databases/DatabaseContext.js";

export const tableName = "eventos";

// Busca todos os eventos ativos e calcula as vagas disponíveis
export async function Get() {
    try {
        const results = await db.execute(
            `SELECT eventos.*,
                eventos.vagas - (
                    SELECT COUNT(*)
                    FROM inscricoes
                    WHERE inscricoes.idevento = eventos.id
                ) AS vagasDisponiveis
             FROM ${tableName}
             WHERE eventos.actived = 1
             ORDER BY eventos.id`
        );

        return {
            message: "Success",
            data: results[0]
        };

    } catch (error) {
        console.log(error);

        return {
            message: "error",
            Error: error.message
        };
    }
}

// Busca um evento pelo ID e calcula as vagas disponíveis
export async function GetById(id) {
    try {
        const results = await db.execute(
            `SELECT eventos.*,
                eventos.vagas - (
                    SELECT COUNT(*)
                    FROM inscricoes
                    WHERE inscricoes.idevento = eventos.id
                ) AS vagasDisponiveis
             FROM ${tableName}
             WHERE eventos.id = ? AND eventos.actived = 1`,
            [id]
        );

        return {
            message: "Success",
            data: results[0]
        };

    } catch (error) {
        return {
            message: "error",
            Error: error.message
        };
    }
}

// Busca os eventos do professor e calcula as vagas disponíveis
export async function GetByProfessor(idprofessor) {
    try {
        const results = await db.execute(
            `SELECT eventos.*,
                eventos.vagas - (
                    SELECT COUNT(*)
                    FROM inscricoes
                    WHERE inscricoes.idevento = eventos.id
                ) AS vagasDisponiveis
             FROM ${tableName}
             WHERE eventos.idprofessor = ?
             AND eventos.actived = 1
             ORDER BY eventos.id DESC`,
            [idprofessor]
        );

        return {
            message: "Success",
            data: results[0]
        };

    } catch (error) {
        console.log(error);

        return {
            message: "error",
            Error: error.message
        };
    }
}

// Cadastra um novo evento
export async function Post(data) {
    try {
        const results = await db.execute(
            `INSERT INTO ${tableName}
            (titulo, descricao, categoria, data, horario, local, vagas, idprofessor)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.titulo,
                data.descricao,
                data.categoria,
                data.data,
                data.horario,
                data.local,
                data.vagas,
                data.idprofessor
            ]
        );

        return {
            message: "Success",
            data: {
                id: results[0].insertId,
                mensagem: "Evento cadastrado com sucesso!"
            }
        };

    } catch (error) {
        console.log(error);

        return {
            message: "error",
            Error: error.message
        };
    }
}

// Desativa um evento sem apagar do banco
export async function Delete(id, idprofessor) {
    try {
        const results = await db.execute(
            `UPDATE ${tableName}
             SET actived = 0
             WHERE id = ? AND idprofessor = ? AND actived = 1`,
            [id, idprofessor]
        );

        return {
            message: "Success",
            data: results[0]
        };

    } catch (error) {
        console.log(error);

        return {
            message: "error",
            Error: error.message
        };
    }
}

// Atualiza um evento criado pelo professor
export async function Update(id, idprofessor, data) {
    try {
        const results = await db.execute(
            `UPDATE ${tableName}
             SET titulo = ?,
                 descricao = ?,
                 categoria = ?,
                 data = ?,
                 horario = ?,
                 local = ?,
                 vagas = ?
             WHERE id = ?
             AND idprofessor = ?
             AND actived = 1`,
            [
                data.titulo,
                data.descricao,
                data.categoria,
                data.data,
                data.horario,
                data.local,
                data.vagas,
                id,
                idprofessor
            ]
        );

        return {
            message: "Success",
            data: results[0]
        };

    } catch (error) {
        console.log(error);

        return {
            message: "error",
            Error: error.message
        };
    }
}
