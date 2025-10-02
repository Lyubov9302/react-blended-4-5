import axios from "axios";
import { Post, UpdateDataPost } from "../types/post";
import { FormData } from "../types/formData";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

interface FetchPostsResponse {
  posts: Post[];
  totalPosts: string;
}

export const fetchPosts = async (searchText: string, page: number): Promise<FetchPostsResponse> => {
  const res = await axios.get<Post[]>("/posts", {
    params: { q: searchText, _limit: 8, _page: page },
  });

  return {
    posts: res.data,
    totalPosts: res.headers["x-total-count"],
  };
};

export const createPost = async (newPost: FormData) => {
  const res = await axios.post<Post>("/posts", newPost);

  return res.data;
};

export const editPost = async (newDataPost: UpdateDataPost) => {
  const res = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);

  return res.data;
};

export const deletePost = async (postId: number) => {
  const res = await axios.delete<Post>(`/posts/${postId}`);

  return res.data;
};
