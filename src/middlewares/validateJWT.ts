import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels';
import ExtendRequest from '../types/extendedRequest';



const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    // logic to validate JWT
    const authorizationHeader = req.get("Authorization");

    if(!authorizationHeader){
       res.status(403).send("Unauthorized");
       return
    }
     const token = authorizationHeader.split(" ")[1];
        if(token === undefined || token === null || token === ""){
            res.status(403).send("Unauthorized");
            return
        }

        jwt.verify(token, 'FWbHkVbAywzNWXaO6ekFa7o4evyxKZXu', async (err, payload) => {
            if(err){
                res.status(403).send("Unauthorized");
                return
            }
                if(!payload ){
                    res.status(403).send("invalid token payload");
                    return
                }

                const userPayload = payload as {email: string , firstname: string, lastname: string};

            const user = await userModel.findOne({email: userPayload.email});
                   req.user = user; 
                     next();
        });
}

export default validateJWT;