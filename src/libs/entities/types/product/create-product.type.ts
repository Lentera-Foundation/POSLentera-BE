export type TCreateProductRequest = {
  product_name: string;
  status: boolean;
  price: number;
  desc?: string;
  category_id: number;
};

export type TCreateProductResponse = {
  message?: string;
  id?: number;
  product_name?: string;
  desc?: string;
  is_ready?: boolean;
  price?: number;
  error?: string;
};
