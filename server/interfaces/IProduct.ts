import { Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    offerPrice: number;
    image: string[];
    description: string[];
    inStock: boolean;
}
