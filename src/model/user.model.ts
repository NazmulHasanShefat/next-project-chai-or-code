import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}
// mongoose er vitore String er S boro hater hobe and type Script er jonny (string) choto hater hobe
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document{
    userName: string;
    email: string;
    passowrd: string;
    varifyCode: string;
    varifyCodeExpire: Date;
    isAcceptingMessage: boolean;
    isVerifide: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "user name is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "user email is required"],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"please user valid email syntex!"],
        unique: true,
    },
    passowrd: {
        type: String,
        required: [true, "user passord is required"],
    },
    varifyCode: {
        type: String,
        required: [true, "user varification is required"],
    },
    varifyCodeExpire: {
        type: Date,
        required: [true, "user Expire varification is required"],
    },
    isVerifide: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [ MessageSchema ],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;