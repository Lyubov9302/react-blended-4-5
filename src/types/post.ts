export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface UpdateDataPost {
  title: string;
  body: string;
  id: number;
}
