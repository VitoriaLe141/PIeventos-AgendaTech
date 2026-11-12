/* ==========================================
   CONTROLLER: USUÁRIOS
   Recebe as requisições de usuários e encaminha
   as operações para o model.
   ========================================== */

import * as myModel from "../model/usersModel.js"
import bcrypt from 'bcryptjs';

// Retorna o nome da tabela usada pelo model.

export function getTableName(){
    return myModel.tableName;
}

// metodo get = verbo get
export async function Get(req,res){
    try {
        const response = await myModel.Get();
        if (response.message.toLowerCase() == "success".toLowerCase() ) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
        
        
    } catch (error) {
        res.status(403).json({"message":"erro", "Error": error.message});
    }
}

// Busca um registro específico usando o ID recebido.

export async function GetById(req,res) {
    try {
        const id = req.params.id;
        const response = await myModel.GetById(id);
        if (response.message.toLowerCase() == "success".toLowerCase() ) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
       res.status(403).json({"message":"erro", "Error": error.message});    
    }
}

// Procura um usuário pelo login ou e-mail informado.

export async function GetByEmail(req,res) {
    try {
        const email = req.params.email;
        const response = await myModel.GetByEmail(email);
        if (response.message.toLowerCase() == "success".toLowerCase() ) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
       res.status(403).json({"message":"erro", "Error": error.message});    
    }
}

// Remove o registro identificado pelo ID recebido.

export async function Delete(req,res) {
    try {
        const id = req.params.id;
        const response = await myModel.Delete(id);
        if (response.message.toLowerCase() == "success".toLowerCase() ) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
       res.status(403).json({"message":"erro", "Error": error.message});    
    }
}

// Cadastra um novo registro usando os dados recebidos.

export async function Post(req,res){
    try {
        const dataBody = req.body;
        if (!dataBody) {
            res.status(415).json({"message":"erro", "Error": "Falha sem Body..."});       
        }
        const { password } = dataBody;
        if ( password ){
            const hashedPassword = await bcrypt.hash(password, 10);
            dataBody.password = hashedPassword
        }

        const response = await myModel.Post(dataBody);
         if (response.message.toLowerCase() == "success".toLowerCase() ) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
       res.status(405).json({"message":"erro", "Error": error.message});  
    }

}

// Atualiza os dados de um registro já existente.

export async function Put(req,res){
    try {
        const id = req.params.id;
        const dataBody = req.body;
        if ( id <= 0 ){
            res.status(416).json({"message":"erro", "Error": "Falha sem ID..."});       
        }
        if (!dataBody) {
            res.status(415).json({"message":"erro", "Error": "Falha sem Body..."});       
        }
        //
        const { password } = dataBody;
        if ( password ){
            const hashedPassword = await bcrypt.hash(password, 10);
            dataBody.password = hashedPassword
        }
        //
        const response = await myModel.Put(dataBody, id );
         if (response.message.toLowerCase() == "success".toLowerCase() ) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        res.status(406).json({"message":"erro", "Error": error.message});  
    }
}
