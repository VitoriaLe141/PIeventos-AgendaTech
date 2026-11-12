
/* ==========================================
   MODEL: INSCRIÇÕES
   Guarda as consultas SQL usadas para cadastrar,
   consultar e cancelar inscrições em eventos.
   ========================================== */

import { db } from "../databases/DatabaseContext.js";

// Nome da tabela usada para guardar as inscrições
export const tableName = "inscricoes";

// Busca as inscrições realizadas pelo aluno conectado
export async function GetByAluno(iduser) {
    try {
        const results = await db.execute(
            `SELECT idevento AS eventoId, created_at AS dataInscricao
             FROM ${tableName}
             WHERE iduser = ?
             ORDER BY created_at DESC`,
            [iduser]
        );

        return { message: "Success", data: results[0] };

    } catch (error) {
        console.log(error);
        return { message: "error", Error: error.message };
    }
}

// Busca os alunos inscritos nos eventos de um professor
export async function GetByProfessor(idprofessor) {
    try {
        const results = await db.execute(
            `SELECT
                inscricoes.id AS inscricaoId,
                inscricoes.created_at AS dataInscricao,
                users.name AS nomeAluno,
                users.login AS raAluno,
                eventos.id AS eventoId,
                eventos.titulo AS tituloEvento,
                eventos.categoria AS categoriaEvento,
                eventos.data AS dataEvento,
                eventos.horario,
                eventos.local
             FROM ${tableName} AS inscricoes
             INNER JOIN eventos ON eventos.id = inscricoes.idevento
             INNER JOIN users ON users.id = inscricoes.iduser
             WHERE eventos.idprofessor = ?
             AND eventos.actived = 1
             ORDER BY eventos.data, users.name`,
            [idprofessor]
        );

        return { message: "Success", data: results[0] };

    } catch (error) {
        console.log(error);
        return { message: "error", Error: error.message };
    }
}

// Confere a existência do evento, as vagas e a inscrição duplicada
export async function Post(idevento, iduser) {
    try {
        // Verifica se o evento existe e está ativo
        const evento = await db.execute(
            `SELECT id, vagas FROM eventos
             WHERE id = ? AND actived = 1`,
            [idevento]
        );

        if (evento[0].length === 0) {
            return {
                message: "error",
                Error: "Evento não encontrado ou indisponível."
            };
        }

        // Impede que o mesmo aluno se inscreva mais de uma vez
        const inscricaoExistente = await db.execute(
            `SELECT id FROM ${tableName}
             WHERE idevento = ? AND iduser = ?`,
            [idevento, iduser]
        );

        if (inscricaoExistente[0].length > 0) {
            return {
                message: "error",
                Error: "Você já está inscrito neste evento."
            };
        }

        // Conta quantas inscrições o evento já possui
        const totalInscritos = await db.execute(
            `SELECT COUNT(*) AS total FROM ${tableName}
             WHERE idevento = ?`,
            [idevento]
        );

        if (Number(totalInscritos[0][0].total) >= Number(evento[0][0].vagas)) {
            return {
                message: "error",
                Error: "Não há vagas disponíveis para este evento."
            };
        }

        // Salva a inscrição no banco de dados
        const resultado = await db.execute(
            `INSERT INTO ${tableName} (idevento, iduser)
             VALUES (?, ?)`,
            [idevento, iduser]
        );

        return {
            message: "Success",
            data: resultado[0]
        };

    } catch (error) {
        console.log(error);
        return { message: "error", Error: error.message };
    }
}

// Remove somente a inscrição do aluno que está conectado
export async function Delete(idevento, iduser) {
    try {
        const resultado = await db.execute(
            `DELETE FROM ${tableName}
             WHERE idevento = ? AND iduser = ?`,
            [idevento, iduser]
        );

        return { message: "Success", data: resultado[0] };

    } catch (error) {
        console.log(error);
        return { message: "error", Error: error.message };
    }
}
