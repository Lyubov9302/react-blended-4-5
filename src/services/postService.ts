import axios from "axios";
import { newDataPost, newPost, Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (searchText: string, page: number) => {
  const response = await axios.get<Post[]>("/posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: 10,
    },
  });
  return response.data;
};

export const createPost = async (data: newPost) => {
  const response = await axios.post<Post>("/posts", data);
  return response.data;
};

export const editPost = async (data: newDataPost) => {
  const response = await axios.patch<Post>(`/posts/${data.id}`, data);
  return response.data;
};

export const deletePost = async (postId: number) => {
  await axios.delete<Post>(`/posts/${postId}`);
};
