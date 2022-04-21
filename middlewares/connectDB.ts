import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import {StandardMessage} from '../types/StandardMessage';

export const connectDB = (handler : NextApiHandler) =>
    //criando função assincorna para poder utilizar comando await
    async (req : NextApiRequest, res : NextApiResponse<StandardMessage | any[]>) => {
    
    //verificar se banco está conectado se tiver ao menos uma conexão ready 
    if(mongoose.connections[0].readyState){ 
        return handler(req, res);
    }

    //se não estiver conectada, conectar
    //obter avariavel preenchida do env 
    const {DB_CONECTION_STRING} = process.env;
        
    if(!DB_CONECTION_STRING){
        return res.status(500).json({ error : 'No conection var available '}); 
    }

    mongoose.connection.on('conected', () => console.log(' DataBase connected '));
    mongoose.connection.on('erro', error => console.log(' DataBase Connection failed'));
    await mongoose.connect(DB_CONECTION_STRING);
        
        //seguir para o endpoint
    return handler(req,res);
}
