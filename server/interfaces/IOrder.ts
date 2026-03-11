import { Document, Types } from "mongoose";

export interface IOrderItem {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItem[];
    address: {
        firstName: string;
        lastName: string;
        email: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
        phone: string;
    };
    amount: number;
    status: "Processing" | "Shipped" | "Delivered";
    paymentMethod: string;
    date: Date;
}
