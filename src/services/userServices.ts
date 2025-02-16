import userModel from "../models/userModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export const register = async ({ email, password, firstname, lastname }: RegisterParams) => {
    try {
        const findUser = await userModel.findOne({ email });

        if (findUser) {
            return { data: "User already exists", statusCode: 400 };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            password: hashedPassword,
            firstname,
            lastname
        });

        await newUser.save();
        return { data: generateJWT({ firstname, lastname, email }), statusCode: 200 };
    } catch (error) {
        console.error("Error in register:", error);
        return { data: "An error occurred while registering", statusCode: 500 };
    }
};

interface LoginParams {
    email: string;
    password: string;
}

export const login = async ({ email, password }: LoginParams) => {
    try {
        const findUser = await userModel.findOne({ email });

        if (!findUser) {
            return { data: "Incorrect email or password", statusCode: 400 };
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (passwordMatch) {
            return { data: generateJWT({ email, firstname: findUser.firstname, lastname: findUser.lastname }), statusCode: 200 };
        }
        return { data: "Incorrect email or password", statusCode: 400 };
    } catch (error) {
        console.error("Error in login:", error);
        return { data: "An error occurred while logging in", statusCode: 500 };
    }
};

const generateJWT = (data: any) => {
    try {
        return jwt.sign(data, process.env.JWT_SECRET || ''); // Added expiration time
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("JWT generation failed");
    }
};
