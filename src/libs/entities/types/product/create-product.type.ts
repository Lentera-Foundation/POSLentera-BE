export type TCreateProductRequest = {
  product_name: string;
  quantity: number;
  price: number;
  desc?: string;
  category_id: number;
};

export type TCreateProductResponse = {
  message?: string;
  id?: number;
  product_name?: string;
  desc?: string;
  quantity?: number;
  price?: number;
  error?: string;
};
