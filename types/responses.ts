export type GroupResponse = {
  id: string;
  title: string;
  photo_url: string;
  admin_id: string;
  created_at: string;
};

export type InvitationResponse = {
  invite_code: string;
  group_id: string;
};

export type UserResponse = {
  id: string;
  name: string;
  photo_url: string;
  group_id: string;
};

export type ExpensesOverviewResponse = {
  user_id: string;
  user_name: string;
  debt: string;
  surplus: string;
  balance: string;
};

export type ExpensesDetailsResponse = {
  ower: {
    id: string;
    name: string;
  };
  payer: {
    id: string;
    name: string;
  };
  amount_owed: string;
};

export type ExpenseHistoryResponse = {
  id: string;
  date: string;
  amount: string;
  payer_id: string;
  description: string;
  created_by: string;
  user: {
    name: string;
    photo_url: string;
  };
};

export type ExpenseParticipants = {
  user_id: string;
  user_name: string;
  user_photo: string;
};
