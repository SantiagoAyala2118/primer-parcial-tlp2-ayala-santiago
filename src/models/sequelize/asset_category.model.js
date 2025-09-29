import { DataTypes } from "sequelize";
import { AssetModel } from "./asset.model";
import { CategoryModel } from "./category.model.js";

export const AssetCategoryModel = sequelize.define("AssetCategory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

// TODO: completar relaciones muchos a muchos entre Asset y Category mediante AssetCategory.
// * N:M Asset ↔ Category through AssetCategory
// * 'categories' (Asset) y 'assets' (Category)
// ! FALTA COMPLETAR ACA

AssetModel.belongsToMany(CategoryModel, {
  through: "AssetCategory",
  foreignKey: "asset_id",
  targetKey: "id",
  as: "categories",
});
CategoryModel.belongsToMany(AssetModel, {
  through: "AssetCategory",
  foreignKey: "category_id",
  targetKey: "id",
  as: "assets",
});

AssetCategoryModel.belongsTo(AssetModel, {
  foreignKey: "asset_id",
  as: "assets",
});
AssetCategoryModel.belongsTo(CategoryModel, {
  foreignKey: "category_id",
  as: "categories",
});
