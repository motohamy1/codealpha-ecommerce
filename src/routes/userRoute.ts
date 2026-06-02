import express from "express";
import { Router } from "express";
import {login, register} from "../services/userService.js";
const router = Router();

router.post('/register', async (request, response) => {
    try {
        const {firstName, lastName, email, password} = request.body;
        const result = await register({firstName, lastName, email, password});
        response.status(201).send(result);
    } catch (error: any) {
        response.status(400).send({ error: error.message });
    }
})

router.post('/login', async (request, response) => {
    try {
        const {email, password} = request.body;
        const result = await login({email, password});
        response.send(result);
    } catch (error: any) {
        response.status(401).send({ error: error.message });
    }
})


export default router;