export type TCardDashboardRequest = {
  start_date?: string;
  end_date?: string;
};

export type TCardDashboardResponse = {
  message?: string;
  error?: string;
  data?: {
    total_order?: number;
    total_income?: number;
    total_net_income?: number;
    average_transaction?: number;
  };
};
