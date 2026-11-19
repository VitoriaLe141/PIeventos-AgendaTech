
/* ==========================================
   MODEL: USUÁRIOS
   Contém as consultas SQL usadas para buscar,
   cadastrar, atualizar e excluir usuários.
   ========================================== */

import { db } from "../databases/DatabaseContext.js";
import * as sqlutils from "../utils/sqlTextos.js";

export const tableName = "users";

// Busca todos os registros disponíveis na tabela,
// sem retornar as senhas.
export async function Get(req, res) {
    try {
        const results = await db.execute(
            `SELECT id, name, login, created_at, actived
             FROM ${tableName}
             ORDER BY id`
        );

        return { "message": "Success", "data": results[0] };

    } catch (error) {
        console.log(error);
        return { "message": "error", "Error": error.message };
    }
}

// Busca um usuário específico pelo ID,
// sem retornar a senha.
export async function GetById(id) {
    try {
        const results = await db.execute(
            `SELECT id, name, login, created_at, actived
             FROM ${tableName}
             WHERE id = ?
             ORDER BY id`,
            [id]
        );

        return { "message": "Success", "data": results[0] };

    } catch (error) {
        return { "message": "error", "Error": error.message };
    }
}

// Procura um usuário pelo login informado.
// Mantém a senha para permitir a autenticação.
export async function GetByEmail(email) {
    try {
        const results = await db.execute(
            `SELECT * FROM ${tableName} WHERE login = ?`,
            [email]
        );

        if (results[0].length === 0) {
            return {
                "message": "error",
                "Error": "registro não localizado"
            };
        }

        return { "message": "Success", "data": results[0] };

    } catch (error) {
        return { "message": "error", "Error": error.message };
    }
}

// Remove o registro identificado pelo ID.
export async function Delete(id) {
    try {
        const results = await db.execute(
            `DELETE FROM ${tableName} WHERE id = ?`,
            [id]
        );

        return { "message": "Success", "data": results };

    } catch (error) {
        return { "message": "error", "Error": error.message };
    }
}

// Cadastra um novo registro.
export async function Post(data) {
    try {
        const payload = data;

        sqlutils.extrair_dados(payload);

        const sqlFields = sqlutils.gerar_sqlFields();
        const sqlParms = sqlutils.gerar_sqlParams();
        const sqlValuesParms = sqlutils.listParms();

        const sqlTexto = `INSERT INTO ${tableName}
            (${sqlFields}) VALUES (${sqlParms})`;

        console.log(sqlTexto);

        const results = await db.execute(
            sqlTexto,
            sqlValuesParms
        );

        return { "message": "Success", "data": results };

    } catch (error) {
        return { "message": "error", "Error": error.message };
    }
}

// Atualiza os dados de um registro existente.
export async function Put(data, id) {
    try {
        sqlutils.extrair_dados(data);

        const sqlSets = sqlutils.gerar_sqlSets();
        const sqlValuesParms = sqlutils.listParms();

        sqlValuesParms.push(id);

        const results = await db.execute(
            `UPDATE ${tableName} SET ${sqlSets} WHERE id = ?`,
            sqlValuesParms
        );

        return { "message": "Success", "data": results };

    } catch (error) {
        return { "message": "error", "Error": error.message };
    }
}
