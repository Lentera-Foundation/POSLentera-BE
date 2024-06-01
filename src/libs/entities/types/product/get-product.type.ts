export type TGetProductResponse = {
  message?: string;
  data?: Array<{
    id?: number;
    product_name?: string;
    desc?: string;
    is_ready?: boolean;
    price?: number;
  }>;
  error?: string;
};
