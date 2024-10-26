import { createTransport } from "nodemailer";

export class Mail {
    static async sendHTML(
        email: string,
        title: string,
        contents: string,
    ) {
        const transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: title,
            html: contents
        });
    }
}