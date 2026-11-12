/* ==========================================
   MODEL: DEPENDÊNCIAS
   Contém as consultas SQL usadas para buscar,
   cadastrar, atualizar e excluir dependências.
   ========================================== */

import { db } from "../databases/DatabaseContext.js";
const tableName = "dependencias";

// Busca todos os registros disponíveis nessa tabela.

export async function Get ( req, res)  {
    try {
        const results = await db.execute(
            `SELECT * FROM ${tableName} ORDER BY id`
        );
        return {"message":"Success","data":results} ;
    } catch (error) {
        console.log(error);
        return {"message": "error", "Error": error.message};
    }
}

// Busca um registro específico usando o ID recebido.

export async function GetById(id){
    try {
        const results = await db.execute(
            `SELECT * FROM ${tableName} WHERE id = ? ORDER BY id `,
            [id]
        );
        return {"message":"Success","data":results} ;
    } catch (error) {
       return {"message": "error", "Error": error.message} 
    }
}

// Remove o registro identificado pelo ID recebido.

export async function Delete(id){
    try {
        const results = await db.execute(
            `DELETE FROM ${tableName} WHERE id = ?`,
            [id]
        );
        return {"message":"Success","data":results} ;
    } catch (error) {
       return {"message": "error", "Error": error.message} 
    }
}

// Cadastra um novo registro usando os dados recebidos.

export async function Post( data ){
    try {
        const {dependencia, capacidade } = data;
        
        const results = await db.execute(
            `INSERT INTO ${tableName} (dependencia, capacidade) VALUES ( ? , ?)`,
            [dependencia , capacidade ]
        );
        return {"message":"Success","data":results} ;
    } catch (error) {
        console.log( error, error.message);
        return {"message": "error", "Error": error.message} 
    }

}

// Atualiza os dados de um registro já existente.

export async function Put( data, id ){
    try {
        const { dependencia, capacidade } = data;
        const results = await db.execute(
            `UPDATE ${tableName} SET dependencia = ?, capacidade = ? WHERE id = ?`,
            [ dependencia , capacidade , id]
        );
        return {"message":"Success","data":results} ;
    } catch (error) {
        return {"message": "error", "Error": error.message} 
    }
}
