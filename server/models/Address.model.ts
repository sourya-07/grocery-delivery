import mongoose, { Schema } from "mongoose";
import { IAddress } from "../interfaces/IAddress";

const AddressSchema: Schema<IAddress> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        firstName: { type: String, required: true, trim: true },
        lastName:  { type: String, required: true, trim: true },
        email:     { type: String, required: true, trim: true },
        street:    { type: String, required: true, trim: true },
        city:      { type: String, required: true, trim: true },
        state:     { type: String, required: true, trim: true },
        zipcode:   { type: String, required: true, trim: true },
        country:   { type: String, required: true, trim: true },
        phone:     { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const AddressModel = mongoose.model<IAddress>("Address", AddressSchema);
export default AddressModel;
