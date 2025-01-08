export type GroupRequest = {
  title: string;
  photo_url: string;
  user: {
    name: string;
    photo_url: string;
  };
};

export type InvitationRequest = {
  group_id: string;
};

export type UserRequest = {
  name: string;
  photo_url: string;
  invite_code: string;
};

export type ExpenseRequest = {
  amount: string; // total amount
  description: string;
  date: string;
  payer_id: string; // user_id
  participants: string[];
  created_by?: string;
};
