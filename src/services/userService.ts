import { userModel } from "../models/userModel.js";
import bcrypt from 'bcrypt';

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const register = async ({firstName, lastName, email, password}: RegisterParams) => {
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
    });
    await newUser.save();
    return newUser;
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
        return findUser;
    }

    throw new Error("Incorrect email or password");
}