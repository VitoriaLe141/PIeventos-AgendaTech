/* ==========================================
   CONTROLLER: MUNICÍPIOS
   Recebe as requisições relacionadas aos municípios
   e encaminha as operações para o model.
   ========================================== */

import * as myModel from "../model/municipiosModel.js"

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
        const response = await myModel.Post(dataBody);
         if (response.message == "Success" ) {
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
