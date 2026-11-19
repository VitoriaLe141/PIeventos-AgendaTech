
import bcrypt from "bcryptjs";

// Cria os usuários e perfis utilizados na demonstração.
export async function seedDatabase(db) {
    // Cria os perfis
    const alunoRole = await db.execute(
        "INSERT INTO roles (role) VALUES (?)",
        ["Aluno"]
    );

    const professorRole = await db.execute(
        "INSERT INTO roles (role) VALUES (?)",
        ["Professor"]
    );

    const idRoleAluno = alunoRole[0].insertId;
    const idRoleProfessor = professorRole[0].insertId;

    // Criptografa as senhas
    const senhaAna = await bcrypt.hash("123456", 10);
    const senhaMarcelo = await bcrypt.hash("789012", 10);

    // Cria a conta da Ana
    const ana = await db.execute(
        `INSERT INTO users (name, login, password)
         VALUES (?, ?, ?)`,
        ["Ana Silva", "1234567890123", senhaAna]
    );

    const idAna = ana[0].insertId;

    // Cria a conta do professor Marcelo
    const marcelo = await db.execute(
        `INSERT INTO users (name, login, password)
         VALUES (?, ?, ?)`,
        [
            "Marcelo Mendes",
            "professor@fatec.sp.gov.br",
            senhaMarcelo
        ]
    );

    const idMarcelo = marcelo[0].insertId;

    // Vincula cada usuário ao seu perfil
    await db.execute(
        "INSERT INTO usersroles (iduser, idroler) VALUES (?, ?)",
        [idAna, idRoleAluno]
    );

    await db.execute(
        "INSERT INTO usersroles (iduser, idroler) VALUES (?, ?)",
        [idMarcelo, idRoleProfessor]
    );

    // Cria o cadastro acadêmico da Ana
    await db.execute(
        `INSERT INTO alunos
        (nome, email, avatar, celular, github, linkdin, cidade, iduser)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            "Ana Silva",
            "anasilva@gmail.com",
            "",
            "16 99845-1006",
            "",
            "",
            "Taquaritinga",
            idAna
        ]
    );

    console.log("Usuários de demonstração cadastrados com sucesso!");
}
