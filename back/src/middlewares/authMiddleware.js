
/* ==========================================
   MIDDLEWARE: AUTENTICAÇÃO
   Verifica o token recebido e identifica o usuário
   que está fazendo a requisição.
   ========================================== */

import jwt from "jsonwebtoken";

// Verifica se o usuário está autenticado
const validarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token não fornecido"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guarda os dados do usuário autenticado
        req.userId = decoded.userId;

        // Padroniza o perfil para letras minúsculas
        req.userRole = String(decoded.role).toLowerCase();

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido ou expirado"
        });
    }
};

export default validarToken;
