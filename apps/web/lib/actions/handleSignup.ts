import prisma from "@repo/db";
import bcrypt from "bcrypt";

export async function handleSignup({email, password, name}: {email: string, password: string, name: string}){
    // const body = { email, password, name };

    try{
        const existingUser = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if(existingUser){
            return { error: "User already exists", status: 400 };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return { message: "User signed up successfully", status: 201 };

    } catch(error){
        console.error("Error during signup:", error);
        return { error: "Internal server error", status: 500 };
    }

}