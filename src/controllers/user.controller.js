import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import axios from "axios";
import nodemailer from 'nodemailer'
import {fastify} from '../index.js'

const signup = async(request,reply)=>{
    const {username,email,password} = request.body;
    if([username,email,password].some(t=>t?.trim() === ''))
    {
        return reply.badRequest('Incomplete Details')
    }
    const existingUser = await User.findOne({email : email});
    if(existingUser)
    {
        return reply.unauthorized('User has already SignedUp')
    }

    //hash the password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)

    try {
        const newUser = (await User.create({username,email,password:hashedPassword}));
        if(!newUser)
        {
            return reply.internalServerError('Error in Signing Up')
        }
        return reply.code(201).send(new ApiResponse(201,'User signed up successfully',{username:newUser.username , email:newUser.email}))
    } catch (error) {
        fastify.log.error(error)
        return reply.internalServerError('Something went wrong try again later')
    }
}

const login = async(request,reply)=>{
    const {email,password} = request.body;
    if(!email||!password)
    {
        return reply.badRequest('Incomplete Details')
    }
    
    const existingUser = await User.findOne({email});
    if(!existingUser)
    {
        return reply.unauthorized('User is not signed up')
    }

    //compare the password
    const isPasswordValid = await existingUser.isPasswordCorrect(password)
    if(!isPasswordValid)
    {
        return reply.forbidden('Invalid Password')
    }

    //generate the token
    const token = await reply.jwtSign({
      _id: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
    });

    const isProd = process.env.NODE_ENV === 'production'
    const options = 
    {
        httpOnly:true,
        secure:isProd,
        sameSite:isProd ? 'none':'lax',
        expires: new Date(Date.now() + 3*24*60*60*100),
        path:'/'
    }
    return reply.code(200)
    .setCookie('token',token,options)
    .send(new ApiResponse(200,'User Logged in Successfully'))
}

const logout = async(request,reply)=>{
  const isProd = process.env.NODE_ENV === 'production'
    const options = 
    {
        httpOnly:true,
        secure:isProd,
        sameSite:isProd ? 'none':'lax',
        expires: new Date(Date.now() + 3*24*60*60*100),
        path:'/'
    }
    return reply.clearCookie('token',options).code(200).send(new ApiResponse(200,'User logged out Successfully',{}))
}

const sendOTP = async (request, reply) => {
  const { email } = request.body;

  if (!email) {
    return reply.badRequest('EmailID not present')
  }
    const email_response = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.EMAIL_CHECKER_API_KEY}`)
    console.log(email_response)
    console.log(email_response.data.data.status)
    if(email_response.data.data.status === 'invalid' || email_response.data.data.status === 'disposable')
    {
        return reply.forbidden('Invalid Email ID')
    }
  const otp = fastify.generateOtp()

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Argumate OTP Verification</title>
      <style>
        .container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          background-color: #ffffff;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .header {
          background-color: #4b0082;
          color: #ffffff;
          padding: 15px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          color: #4b0082;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #777;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body style="background-color: #f6f6f6;">
      <div class="container">
        <div class="header">Argumate</div>
        <div class="content">
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          © 2025 Argumate. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  // Setup Zoho Nodemailer transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SEND_MAIL,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `Argumate <${process.env.SEND_MAIL}>`,
    to: `${email}`,
    subject: 'Your Argumate OTP Code',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    return reply.code(200).send(
      new ApiResponse(200, 'OTP sent successfully', { otp })
    );
  } catch (error) {
    fastify.log.error(error)
    return reply.internalServerError('Failed to send email')
  }
};

const checkSignedUp = async(req,reply)=>{
    const {username,email,password} = req.body;
    if([username,email,password].some(t=>t?.trim() === ''))
    {
        return reply.badRequest('Missing Details')
    }
    const existingUser = await User.findOne({email : email});
    if(existingUser)
    {
        return reply.unauthorized('User has already SignedUp')
    }
    return reply.code(200).send(new ApiResponse(200,'User has not signed up already'))
};

export {signup,login,logout,sendOTP,checkSignedUp}