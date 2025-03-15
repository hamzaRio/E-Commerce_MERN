import express from "express";
import { getOrdersForUser, login, register } from "../services/userServices";
import ExtendRequest from "../types/extendedRequest";




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

route.get('/my-orders', async (request: ExtendRequest, response) => {
    try {
        const userId = request?.user?._id;
        const { statusCode, data } = await getOrdersForUser({ userId });

        response.status(statusCode).json(data);
    } catch (err) {
        console.error("Error in route /my-orders:", err);
        response.status(500).send({ error: "Failed to get orders!" });
    }
});






export default route;