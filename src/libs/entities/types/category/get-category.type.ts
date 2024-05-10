export type TGetCategoryResponse = {
  message?: string;
  data?: Array<{
    id?: number;
    category_name?: string;
    desc?: string;
  }>;
  error?: string;
};
