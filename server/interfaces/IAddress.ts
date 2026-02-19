import { Document, Types } from "mongoose";

export interface IAddress extends Document {
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
}
