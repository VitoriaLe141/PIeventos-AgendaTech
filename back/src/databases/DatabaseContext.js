
/* ==========================================
   CONTEXTO DO BANCO DE DADOS
   Inicializa a conexão escolhida no arquivo .env
   e disponibiliza as consultas para os models.
   ========================================== */

import { createDatabaseIfNotExists, pool } from "./connections/connectionMysql.js";
import { getDbConnection } from "./connections/connectionSqllite.js";
import { MySQLStrategy, SQLiteStrategy } from "./DatabaseStrategy.js";
import { DatabaseSchema } from "./schema/databaseSchema.js";
import { seedDatabase } from "./seedDatabase.js";

class DatabaseContext {
    constructor() {
        this.strategy = null;
    }

    // Cadastra os usuários de demonstração somente
    // quando ainda não existem usuários no banco.
    async seedSeNecessario() {
        const [usuarios] = await this.execute(
            "SELECT COUNT(*) AS total FROM users"
        );

        const totalUsuarios = Number(usuarios[0].total);

        if (totalUsuarios === 0) {
            console.log("Nenhum usuário encontrado. Criando contas de demonstração...");
            await seedDatabase(this);
        } else {
            console.log("Usuários já cadastrados. Mantendo os dados existentes.");
        }
    }

    async init() {
        // Centraliza a configuração de reset.
        const resetarBanco = process.env.DB_RESET?.toLowerCase() === 'true';

        const db_name = process.env.DB_DATABASE?.toLowerCase() || 'apirest';

        if (process.env.DB_TYPE === 'sqlite') {

            // Conecta ao SQLite.
            const db = await getDbConnection(resetarBanco);

            this.strategy = new SQLiteStrategy(db);

            // Define as configurações da estratégia.
            this.strategy.type = 'sqlite';
            this.strategy.databaseName = db_name;

            // Inicializa as tabelas.
            await DatabaseSchema.initialize(this.strategy, resetarBanco);

            // Verifica se precisa cadastrar os usuários.
            await this.seedSeNecessario();

            console.log("Ambiente SQLite configurado com sucesso.");

        } else {

            // Garante que o banco MySQL/MariaDB existe.
            await createDatabaseIfNotExists();

            this.strategy = new MySQLStrategy(pool);

            // Define as configurações da estratégia.
            this.strategy.type = 'mysql';
            this.strategy.databaseName = db_name;

            // Inicializa as tabelas.
            await DatabaseSchema.initialize(this.strategy, resetarBanco);

            // Verifica se precisa cadastrar os usuários.
            await this.seedSeNecessario();

            console.log("Ambiente MySQL configurado com sucesso.");
        }
    }

    async execute(query, params) {
        if (!this.strategy) {
            throw new Error("Contexto de banco de dados não inicializado.");
        }

        return await this.strategy.execute(query, params);
    }
}

export const db = new DatabaseContext();

await db.init();
