
/* ==========================================
   SCHEMA DO BANCO DE DADOS
   Lê as definições do schema.json e cria as tabelas
   que ainda não existem no banco selecionado.
   ========================================== */

import schemaData from './schema.json' with { type: 'json' };

// Mapeamento dos tipos para cada banco de dados
const TYPE_MAP = {
    sqlite: {
        int: "INTEGER",
        default: "DEFAULT",
        defaultDatetime: "CURRENT_DATE",
        datetime: "TEXT",
        string: "TEXT",
        boolean: "INTEGER",
        autoIncrement: "AUTOINCREMENT",
        primaryKey: "PRIMARY KEY"
    },

    mysql: {
        int: "INT",
        datetime: "DATETIME",
        default: "DEFAULT",
        defaultDatetime: "CURRENT_TIMESTAMP",
        defaultBoolean: [false, true],
        string: "VARCHAR",
        boolean: "BOOLEAN",
        size: "100",
        decimal: "3",
        autoIncrement: "AUTO_INCREMENT",
        primaryKey: "PRIMARY KEY"
    },

    sqlserver: {
        int: "INT",
        datetime: "DATETIME",
        default: "DEFAULT",
        defaultDatetime: "CURRENT_TIMESTAMP",
        defaultBoolean: [false, true],
        string: "VARCHAR",
        boolean: "BOOLEAN",
        size: "100",
        decimal: "3",
        autoIncrement: "AUTO_INCREMENT",
        primaryKey: "PRIMARY KEY"
    }
};

export class DatabaseSchema {

    static async initialize(dbStrategy, forceRefresh = false) {

        const dialect = dbStrategy.type;

        if (!dialect || !TYPE_MAP[dialect]) {
            throw new Error(
                `[ORM] Dialeto '${dialect}' não suportado pelo Schema.`
            );
        }

        console.log(
            `[ORM] Verificando estrutura para: ${dialect.toUpperCase()}...`
        );

        const dbName = dbStrategy.databaseName;
        const map = TYPE_MAP[dialect];
        const queries = [];

        console.log(`schema: ${forceRefresh} - ${dbName} e ${dialect}`);

        // Tratamento de criação do banco
        if (forceRefresh && dbName) {

            if (dialect === 'mysql') {
                // O banco MySQL é criado pela conexão.

            } else if (dialect === 'sqlserver') {

                queries.push(`USE master;`);

                queries.push(
                    `IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'${dbName}')
                    CREATE DATABASE [${dbName}];`
                );

                queries.push(`USE [${dbName}];`);
            }
        }

        // Desativa temporariamente a verificação de chaves estrangeiras no MySQL
        if (forceRefresh && dialect === 'mysql') {
            queries.push(`SET FOREIGN_KEY_CHECKS = 0;`);
        }

        // Percorre todas as tabelas do schema.json
        for (const [tableName, tableConfig] of Object.entries(schemaData.tables)) {

            if (forceRefresh) {
                queries.push(`DROP TABLE IF EXISTS ${tableName};`);
            }

            const columnDefinitions = [];

            // Percorre todas as colunas da tabela
            for (const [columnName, colConfig] of Object.entries(tableConfig.columns)) {

                let tipo = map[colConfig.type];

                if (!tipo) {
                    throw new Error(
                        `Tipo '${colConfig.type}' não configurado para ${dialect}. Coluna: ${columnName}`
                    );
                }

                let def = `${columnName} ${tipo}`;

                // Define o tamanho do campo quando necessário
                if (map.size && colConfig.size) {
                    def += `(${colConfig.size})`;
                }

                // Chave primária e autoincremento
                if (colConfig.primaryKey) {
                    def += ` ${map.primaryKey}`;
                }

                if (colConfig.autoIncrement) {
                    def += ` ${map.autoIncrement}`;
                }

                // Define se o campo aceita valores nulos
                if (colConfig.nullable === false && !colConfig.primaryKey) {
                    def += " NOT NULL";
                } else if (colConfig.nullable === true) {
                    def += " NULL";
                }

                // Define os valores padrão
                if (
                    map.default &&
                    colConfig.default !== undefined &&
                    colConfig.default !== null
                ) {

                    switch (colConfig.type) {

                        case "datetime":
                            def += ` DEFAULT (${map.defaultDatetime})`;
                            break;

                        case "boolean":
                            def += colConfig.default === true
                                ? ` DEFAULT(1)`
                                : ` DEFAULT(0)`;
                            break;

                        default:
                            def += ` DEFAULT(${colConfig.default})`;
                            break;
                    }
                }

                columnDefinitions.push(def);
            }

            const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
                ${columnDefinitions.join(',\n                ')}
            );`;

            queries.push(sql);
        }

        // Executa os comandos de criação
        for (const query of queries) {
            console.log(query);
            await dbStrategy.execute(query);
        }

        // Reativa a verificação de chaves estrangeiras no MySQL
        if (forceRefresh && dialect === 'mysql') {
            await dbStrategy.execute(`SET FOREIGN_KEY_CHECKS = 1;`);
        }

        console.log(
            `[ORM] Tabelas sincronizadas com sucesso no ${dialect.toUpperCase()}.`
        );
    }
}
