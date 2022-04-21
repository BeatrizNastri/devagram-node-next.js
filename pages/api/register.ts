import type { NextApiRequest, NextApiResponse } from "next";
import type { StandardMessage } from "../../types/StandardMessage";
import type { RegisterRequisition } from "../../types/RegisterRequisition";
import { userModel } from "../../model/usersModel";
import md5 from 'md5';
import { connectDB } from "../../middlewares/connectDB";

const endpointRegister = async (req : NextApiRequest, res : NextApiResponse<StandardMessage>) => {

    if(req.method === 'POST'){
        const user = req.body as RegisterRequisition;

        if (!user.name || user.name.length <2){
            return res.status(400).json ({ error : 'Invalid Name' });
        }
        if (!user.email || user.email.length < 5 || !user.email.includes('@') || !user.email.includes(".")){
            return res.status(400).json ({ error : 'Invalid Email' });
        }
        if(!user.password || user.password.length < 4){
            return res.status(400).json ({ error : 'Invalid Password' });
        }

        //validating email adress
        const sameEmailUsers = await userModel.find({email: user.email});
        if (sameEmailUsers && sameEmailUsers.length > 0){
            return res.status(400).json ({ error : 'Email already registered' });
        }

        //saving information in database
        const userToBeSaved = {
            name: user.name,
            email: user.email,
            password: md5(user.password)

        }
        await userModel.create(userToBeSaved);
        return res.status(200).json ({ msg : 'Registered Successfully' });
    } 
    return res.status(405).json({ error : 'Invalid Method' });
}

export default connectDB(endpointRegister);