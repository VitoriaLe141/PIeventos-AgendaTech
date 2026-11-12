/* ==========================================
   CONEXÃO MYSQL
   Configura a conexão e o pool de acesso ao banco MySQL.
   ========================================== */

import dotenv from 'dotenv';
import mysql from "mysql2/promise";
dotenv.config();

// const DB_HOST = process.env.DB_HOST || 'localhost';
// const DB_USER = process.env.DB_USER || 'root';
// const DB_PORT = process.env.DB_PORT || 3306 ;
// const DB_DATABASE = process.env.DB_DATABASE || 'mysql';
// const DB_PASSWORD = process.env.DB_PASSWORD || '';




const {
    DB_HOST,
    DB_USER,
    DB_PORT,
    DB_PASSWORD,
    DB_DATABASE
} = process.env;

export const pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            port: DB_PORT,
            password: DB_PASSWORD,
            database: DB_DATABASE
        });

// Cria o banco MySQL caso ele ainda não exista.

export const createDatabaseIfNotExists = async () => {

    const connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        port: DB_PORT,
        password: DB_PASSWORD
    });

    await connection.query(`
        CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\`
    `);

    await connection.end();

    console.log(`Banco ${DB_DATABASE} verificado/criado.`);
};

// Testa se a conexão com o MySQL está funcionando.

export async function testConnection() {
    try {
        // Tenta obter uma conexão do pool
        const connection = await pool.getConnection();
        console.log('✅ Conexão estabelecida com sucesso!');

        // Libera a conexão de volta para o pool
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    }
}        
