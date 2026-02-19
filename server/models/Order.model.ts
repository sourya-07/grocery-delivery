import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interfaces/IOrder";

const OrderItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
        },
    },
    { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator: (items: any[]) => items.length > 0,
                message: "Order must contain at least one item",
            },
        },
        address: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipcode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
        },
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount cannot be negative"],
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing",
        },
        paymentMethod: {
            type: String,
            default: "COD",
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
export default OrderModel;
