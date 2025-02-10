import express from "express";
import { login, register } from "../services/userServices";



const route  = express.Router();

route.post('/register',  async ( request,response) => {
    const { email, password, firstname, lastname } = request.body;
    const {statusCode, data} = await register({ email, password, firstname, lastname });
    response.status(statusCode).send(data);
});

route.post('/login', async (request, response) => {
    const { email, password } = request.body;
    const {statusCode, data} = await login({ email, password });
    response.status(statusCode).send(data);
});





export default route;