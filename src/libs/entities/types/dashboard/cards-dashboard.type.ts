export type TCardDashboardRequest = {
  start_date?: string;
  end_date?: string;
};

export type TCardDashboardResponse = {
  message: string;
  error?: string;
  data?: {
    totalOrder: number;
    offlineOrder: number;
    goFoodOrder: number;
    grabFoodOrder: number;
    shopeeFoodOrder: number;
  };
};
