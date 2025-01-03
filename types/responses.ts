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

export type ExpensesSummaryResponse = {
  user_id: string;
  user_name: string;
  debt: string;
  surplus: string;
  balance: string;
};
