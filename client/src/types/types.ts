export interface IUser {
  id: string;
  username: string;
  email: string;
  reputation: number;
}

export interface IAuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

export interface IAnswer {
  _id: string;
  content: string;
  author: IUser;
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
}

export interface QuestionFormData {
  title: string;
  content: string;
  tags: string;
}

export interface IQuestion {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: IUser;
  answers: IAnswer[];
  upvotes: string[];
  downvotes: string[];
  views: number;
  createdAt: string;
}

export interface IComment {
  _id: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

export interface ICommentFormData {
  content: string;
}
