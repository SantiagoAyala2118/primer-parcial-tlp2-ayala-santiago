import { Schema, model } from "mongoose";

// TODO: configurar el virtuals para el populate inverso con assets

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 100,
    },
    description: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

CategorySchema.pre("findByIdAndDelete", async (doc) => {
  if (!doc) return;

  if (doc) {
    const ArticleModel = model("Article");

    await ArticleModel.deleteMany({ author: doc._id });
  }
});

CategorySchema.virtual("assets", {
  ref: "Asset",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

export const CategoryModel = model("Category", CategorySchema);
