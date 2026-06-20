import { userModel } from "../models/userModel.ts";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "user" | "admin";
}

export const register = async ({firstName, lastName, email, password, role}: RegisterParams) => {
    const findUser = await userModel.findOne({ email });
    if (findUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || "user"
    });
    await newUser.save();
    return generateToken({firstName, lastName, email, role: newUser.role});
}

interface LoginParams {
    email: string;
    password: string;
}

export const login = async ({ email, password}: LoginParams) => {
    const findUser = await userModel.findOne({email})
    if (!findUser) {
        throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
        return generateToken({
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: findUser.email,
            role: findUser.role
        });
    }

    throw new Error("Incorrect email or password");
}

const generateToken = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRET || "secretkey");
}