export type AuthUser = {
  _id: string;
  name: string;
  photoUrl: string;
  email: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
  __v?: number;
};

export type Chat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[]; // Array of User objects
  groupAdmin: User;
  latestMessage: Message;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type Message = {
  _id: string;
  sender: User;
  chat: Chat;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

// export type FullMessage = Message &{
//   chat:Chat,
//   sender:User
// }
