import axios from "axios";
import { Post, PostFormData } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (searchText: string, page: number) => {
  const response = await axios.get<Post[]>("/posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: 10,
    },
  });
  return {
    posts: response.data,
    totalCount: parseInt(response.headers["x-total-count"] || "0", 10),
  };
};

export const createPost = async (newPost: PostFormData): Promise<PostFormData> => {
  const response = await axios.post<PostFormData>("/posts", newPost);
  return response.data;
};

export const editPost = async (newDataPost: PostFormData): Promise<PostFormData> => {
  const response = await axios.patch<PostFormData>(`/posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await axios.delete<Post>(`/posts/${postId}`);
};
