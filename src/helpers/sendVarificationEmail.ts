import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";


export async function sendVarificationEmail(
    email: string,
    userName: string,
    varifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Nazmul site Verification code',
            react: VerificationEmail({userName, otp: varifyCode}),
        });
        return { success: true, message: "verification email send sucessfully" };
    } catch (emailError) {
        console.log("⚠️ faild to send verification email", emailError);
        return { success: false, message: "Faild to send verification email" };
    }
}