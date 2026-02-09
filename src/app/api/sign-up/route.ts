import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

import { sendVarificationEmail } from "@/helpers/sendVarificationEmail";

export async function POST(Request: Request) {
  await dbConnect();
  try {
    const { userName, email, password } = await Request.json();
    const existingUserVerifideByUserName = await UserModel.findOne({
      userName,
      isVerifide: true,
    });

    if (existingUserVerifideByUserName) {
      return Response.json(
        {
          success: false,
          message: "userName is alrady exist",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCodeOtp = await Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerifide) {
        return Response.json(
          {
            success: false,
            message: "User alrady exist with this email",
          },
          { status: 400 },
        );
      }else{
        const hashedPassWord = await bcrypt.hash(password, 10);
        existingUserByEmail.passowrd = hashedPassWord;
        existingUserByEmail.varifyCode = verifyCodeOtp;
        existingUserByEmail.varifyCodeExpire = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassWord = await bcrypt.hash(password, 10);
      const expireyDate = new Date();
      expireyDate.setHours(expireyDate.getHours() + 1);

      const newUser = new UserModel({
        userName,
        email,
        passowrd: hashedPassWord,
        varifyCode: verifyCodeOtp,
        varifyCodeExpire: expireyDate,
        isVerifide: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send varification email
    const emailResponse = await sendVarificationEmail(
      email,
      userName,
      verifyCodeOtp,
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "user Register successfully please verify your email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("⚠️ Error Resitaring user", error);
    return Response.json(
      {
        success: false,
        message: "⚠️ Error Resitaring user",
      },
      {
        status: 500,
      },
    );
  }
}
