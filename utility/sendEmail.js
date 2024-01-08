/* eslint-disable no-undef */
import nodemailer from 'nodemailer'

export const sendEmail = async (option)=>{


   const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
         user: "0d48bef8a43eae",
         pass: "baba3bcbb3f725"
      }
   })

   const mailOption = {
      from: "E-Shop <kutaibaalnizaemy@gmail.com>",
      to: option.email,
      subject: option.subject,
      text: option.message
   }
   await transporter.sendMail(mailOption)
}