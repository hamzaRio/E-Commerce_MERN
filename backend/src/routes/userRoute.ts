import express from "express";
import { login, register } from "../services/userServices";



const route  = express.Router();

route.post('/register',  async ( request,response) => {
    try {
    const { email, password, firstname, lastname } = request.body;
    const {statusCode, data} = await register({ email, password, firstname, lastname });
    response.status(statusCode).json(data);
    } catch(err){

        response.status(500).send({ message: "Internal Server Error" });
       
    }
});

route.post('/login', async (request, response) => {
    try{
        const { email, password } = request.body;
        const {statusCode, data} = await login({ email, password });
        response.status(statusCode).json(data);
    }catch(err) {
        response.status(500).send({ message: "Internal Server Error" });
    }
    
});





export default route;