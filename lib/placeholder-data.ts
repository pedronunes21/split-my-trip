const placeholderGroups = [
  {
    id: "8c96578c-f40f-4c13-861c-39ed30c1d47a",
    title: "Praia Itapema",
    photo_url:
      "https://img.freepik.com/free-vector/hand-drawn-summer-background-videocalls_23-2148944813.jpg",
    admin: {
      id: "0140e285-858b-44c7-8e94-1f5a8f2d3bb0",
      name: "Pedro",
      photo_url: "https://github.com/pedronunes21.png",
    },
    users: [
      {
        id: "f781b784-17bf-46b8-8da0-cb7963287636",
        name: "Alex",
        photo_url: "https://github.com/alex.png",
      },
      {
        id: "1a88e4d4-c904-4d13-9966-dcb32aad8c3f",
        name: "Paulo",
        photo_url: "https://github.com/paulo.png",
      },
    ],
    expenses: [
      {
        id: "bed94b0e-a0ff-480d-8552-07c2925f1492",
        amount: 150.0,
        description: "Almoço no restaurante",
        date: new Date().toISOString(),
        payer_id: "0140e285-858b-44c7-8e94-1f5a8f2d3bb0",
        participants: [
          {
            user_id: "0140e285-858b-44c7-8e94-1f5a8f2d3bb0",
          },
          {
            user_id: "f781b784-17bf-46b8-8da0-cb7963287636",
          },
          {
            user_id: "1a88e4d4-c904-4d13-9966-dcb32aad8c3f",
          },
        ],
      },
      {
        id: "becb19f6-8a24-4f49-a54a-fed0b43ce7e1",
        amount: 150.0,
        description: "Retroescavadeira de brinquedo para cavar.",
        date: new Date().toISOString(),
        payer_id: "f781b784-17bf-46b8-8da0-cb7963287636",
        participants: [
          {
            user_id: "0140e285-858b-44c7-8e94-1f5a8f2d3bb0",
          },
          {
            user_id: "f781b784-17bf-46b8-8da0-cb7963287636",
          },
        ],
      },
    ],
  },
];

export { placeholderGroups };
