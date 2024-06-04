export type TCreateProductRequest = {
  product_name: string;
  status: string;
  price: number;
  equity: number;
  desc?: string;
  category_id: number;
  image_url?: string;
};

export type TCreateProductResponse = {
  message?: string;
  id?: number;
  product_name?: string;
  desc?: string;
  is_ready?: boolean;
  image_url?: string;
  price?: number;
  equity?: number;
  error?: string;
};
