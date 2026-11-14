/* ==========================================
   CONTROLLER: AUTENTICAÇÃO
   Cuida do cadastro e do login dos usuários,
   conferindo os dados e criando o token de acesso.
   ========================================== */


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as UserModel from "../model/usersModel.js";
import * as UsersRolesModel from "../model/usersRolesModel.js";

// Função de logout
export const logouf = async (req, res) => {
    return res.json({ message: "Logout realizado." });
};

// Função de cadastro
export const register = async (req, res) => {
    const { name, login, password } = req.body;

    const user = await UserModel.GetByEmail(login);

    if (user.message === "Success") {
        return res.status(400).json({
            message: "Login já cadastrado."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await UserModel.Post({
        name,
        login,
        password: hashedPassword
    });

    console.log( response );
    // caso a mensagem contida em reponse seja sucesso, registre uma role para o usuario atual
    if ( response.message === "Success") {
        const  newId = response.data[0].insertId ;
        const irRoler = 1 ;

        const newUserRole  = {
            "iduser": newId,
            "idroler": irRoler
        }
        const responseRole = await UsersRolesModel.Post(newUserRole);
        console.log( responseRole ) ;
        if ( responseRole.message !== "Success") {
             return res.status(401).json({
                message: "falha ao atrituir Roles"
                
            });
        }
    }
    return res.status(201).json(response);
};

// Função de login
export const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        // Verifica se os campos foram preenchidos
        if (!login || !password) {
            return res.status(400).json({
                message: "Informe o login e a senha."
            });
        }
        
        

        // Procura o RA ou e-mail no banco
        const user = await UserModel.GetByEmail(login.trim());

        if (user.message !== "Success" || !user.data || user.data.length === 0) {
            return res.status(401).json({
                message: "Usuário não encontrado."
            });
        }

        const usuario = user.data[0];
       
        // Confere a senha
        const senhaValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!senhaValida) {
            return res.status(401).json({
                message: "Senha incorreta."
            });
        }
        console.log( ` perfil usuario: ${usuario.id}`)    
        // Busca o perfil do usuário
        const resultadoPerfil = await UsersRolesModel.GetRoleByUserId(
            usuario.id
        );
        console.log( resultadoPerfil );
        
        if (resultadoPerfil.message !== "Success") {
            return res.status(403).json({
                message: "Este usuário não possui um perfil cadastrado."
            });
        }

        const perfil = resultadoPerfil.data.role;

        // Cria o token incluindo o perfil
        const token = jwt.sign(
            {
                userId: usuario.id,
                userName: usuario.name,
                role: perfil
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Retorna os dados do usuário e seu perfil
        return res.json({
            message: "sucess",
            data: token,
            user: {
                id: usuario.id,
                name: usuario.name,
                login: usuario.login,
                role: perfil
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);

        return res.status(500).json({
            message: "Erro interno ao realizar login."
        });
    }
};
