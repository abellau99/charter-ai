import { SchemaOptions } from "mongoose";
// enable the use of virtuals
export const options: SchemaOptions = {
  toJSON: { getters: true, virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
};
