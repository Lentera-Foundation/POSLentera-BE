export type TCreateProductRequest = {
  product_name: string;
  status: boolean;
  price: number;
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
  error?: string;
};
