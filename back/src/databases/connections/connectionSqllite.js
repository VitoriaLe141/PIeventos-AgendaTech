
/* ==========================================
   CONEXÃO SQLITE
   Configura e abre o arquivo do banco SQLite.
   ========================================== */

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DATABASE = process.env.DB_DATABASE || 'database';

const DB_PATH = path.join(
    __dirname,
    `../${DB_DATABASE}.db`
);

// Abre a conexão com o arquivo do banco SQLite.
export const getDbConnection = async (forceRefresh = false) => {

    const filename = DB_PATH;

    console.log('--------------------------------');
    console.log('Abrindo banco SQLite');
    console.log('DB_PATH:', filename);
    console.log('forceRefresh:', forceRefresh);
    console.log('Banco existe?', fs.existsSync(filename));
    console.log('--------------------------------');

    // Se forceRefresh for true, apaga o banco existente.
    if (forceRefresh === true && fs.existsSync(filename)) {
        fs.unlinkSync(filename);
        console.log(`Banco de dados removido: ${filename}`);
    }

    // Cria e abre o banco caso ele ainda não exista.
    // Se já existir, apenas abre sem apagar os dados.
    const db = await open({
        filename,
        driver: sqlite3.Database
    });

    console.log('Conexão SQLite estabelecida com sucesso!');

    return db;
};
