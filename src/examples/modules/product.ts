import type { IModule } from "../../interfaces/project.interface";
import { brandForm } from "../components/forms/brand.form";
import { productForm } from "../components/forms/product.form";
import { brandList } from "../components/lists/brand.list";
import { productList } from "../components/lists/product.list";

export const productModule: IModule = {
  id: "productModule",
  title: "Produto",
  icon: "inventory_2",
  components: [productForm, productList, brandForm, brandList],
};
