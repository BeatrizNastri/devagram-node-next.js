import type { NextApiRequest, NextApiResponse } from "next";

export default (
    req: NextApiRequest,
    res: NextApiResponse
)=> {
    if(req.method === 'POST'){
        const {login, password} = req.body;
        if (login === 'admin@admin.com' &&
            password === 'Admin@123'){
                return res.status(200).json({ msg: 'Loged in Successfully'})
        }
        return res.status(400).json({ erro: 'Invalid User or Password'})
    }
    return res.status(405).json({ erro: 'Invalid Method' })
}