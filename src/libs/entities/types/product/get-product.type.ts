export type TGetProductResponse = {
  message?: string;
  data?: Array<{
    id?: number;
    product_name?: string;
    desc?: string;
    quantity?: number;
    price?: number;
  }>;
  error?: string;
};
