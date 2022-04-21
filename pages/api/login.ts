import type {NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../middlewares/connectDB";
import type { StandardMessage } from "../../types/StandardMessage";
import md5 from "md5";
import { userModel } from "../../model/usersModel";
import jwt from 'jsonwebtoken';
import { LoginMessages } from "../../types/LoginMessages";

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<StandardMessage | LoginMessages>
) => {

    const {MY_KEY_JWT} = process.env;
    if(!MY_KEY_JWT){
        return res.status(500).json({ error: 'Incorrect JWT key'});

    }

    if(req.method === 'POST'){
        const {login, password} = req.body;

        const userFinding = await userModel.find({ email: login, password : md5(password)});
        if (userFinding && userFinding.length >0 ){
            const userFound = userFinding[0];

            const token = jwt.sign({ _id : userFound._id}, MY_KEY_JWT );
            return res.status(200).json({ 
                name: userFound.name,
                email: userFound.email, 
                token });
        }
        return res.status(400).json({ error: 'Invalid User or Password'})
    }
    return res.status(405).json({ error: 'Invalid Method' })
}

export default connectDB(endpointLogin);