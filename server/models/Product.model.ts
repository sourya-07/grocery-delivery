import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/IProduct";

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        offerPrice: {
            type: Number,
            default: 0,
            min: [0, "Offer price cannot be negative"],
        },
        image: {
            type: [String],
            default: [],
        },
        description: {
            type: [String],
            default: [],
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
export default ProductModel;
