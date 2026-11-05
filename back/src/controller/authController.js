
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as UserModel from "../model/usersModel.js";

// Função de logout
export const logouf = async (req, res) => {
    return res.json({ message: "Logout realizado." });
};

// Função de cadastro
export const register = async (req, res) => {
    const { name, login, password } = req.body;

    // Verifica se o RA já está cadastrado
    const user = await UserModel.GetByEmail(login);

    if (user.message === "Success") {
        return res.status(400).json({
            message: "RA já cadastrado."
        });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await UserModel.Post({
        name,
        login,
        password: hashedPassword
    });

    return res.status(201).json(response);
};

// Função de login
export const login = async (req, res) => {
    const { login, password } = req.body;

    // Procura o RA no banco de dados
    const user = await UserModel.GetByEmail(login);

    // Verifica se o RA existe
    if (user.message !== "Success" || !user.data || user.data.length === 0) {
        return res.status(401).json({
            message: "RA não encontrado."
        });
    }

    const responseData = user.data[0];

    // Compara a senha digitada com a senha cadastrada
    const valid = await bcrypt.compare(password, responseData.password);

    // Verifica se a senha está correta
    if (!valid) {
        return res.status(401).json({
            message: "Senha incorreta."
        });
    }

    // Cria o token de autenticação
    const token = jwt.sign(
        {
            userId: responseData.id,
            userName: responseData.name
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    // Retorna os dados do usuário
    return res.json({
        message: "sucess",
        data: token,
        user: {
            id: responseData.id,
            name: responseData.name
        }
    });
};
