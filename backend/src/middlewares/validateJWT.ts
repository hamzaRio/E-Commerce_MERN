import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels';
import ExtendRequest from '../types/extendedRequest';



const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    // logic to validate JWT
    const authorizationHeader = req.get("Authorization");

    if(!authorizationHeader){
       res.status(403).send("Unauthorized Header was not provided");
       return
    }
     const token = authorizationHeader.split(" ")[1];
        if(!token){
            res.status(403).send(" Bearer token was not provided");
            return
        }

        jwt.verify(token, process.env.JWT_SECRET || "", async (err: Error | null, payload) => {
            if(err){
                res.status(403).send("Invalid token");
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