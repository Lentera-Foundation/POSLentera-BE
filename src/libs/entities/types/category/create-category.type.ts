export type TCreateCategoryRequest = {
  category_name: string;
  desc?: string;
};

export type TCreateCategoryResponse = {
  message?: string;
  id?: number;
  category_name?: string;
  error?: string;
};
