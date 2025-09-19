import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, editPost, fetchPosts } from "../../services/postService";
import { Post } from "../../types/post";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import EditPostForm from "../EditPostForm/EditPostForm";
import CreatePostForm from "../CreatePostForm/CreatePostForm";

export default function App() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSetSearchValue = useDebouncedCallback((val: string) => {
    setSearchValue(val);
  }, 300);

  const {
    data: postsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", searchValue, currentPage],
    queryFn: () => fetchPosts(searchValue, currentPage),
  });

  const createMutation = useMutation({
    mutationFn: (newPost: Post) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Пост успішно створено!");
    },
    onError: () => {
      toast.error("Помилка створення поста.");
    },
  });

  const editMutation = useMutation({
    mutationFn: (updatedPost: Post) => editPost(updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Пост успішно оновлено!");
    },
    onError: () => {
      toast.error("Помилка оновлення поста.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: () => {
      toast.error("Error deleting post.");
    },
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setPostToEdit(null);
  };

  const handleCreateButtonClick = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  const handleCreate = (newPost: Post) => {
    createMutation.mutate(newPost);
    toggleModal();
  };

  const handleUpdate = (updatedPost: Post) => {
    editMutation.mutate(updatedPost);
    toggleModal();
  };

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected + 1);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = (val: string) => {
    debouncedSetSearchValue(val);
    setCurrentPage(1);
  };

  const posts = postsData?.posts || [];
  const totalPages = postsData?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={handleCreateButtonClick}>
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          {postToEdit ? (
            <EditPostForm
              post={postToEdit}
              onClose={toggleModal}
              onUpdate={handleUpdate}
              isPending={editMutation.isPending}
            />
          ) : (
            <CreatePostForm
              onClose={toggleModal}
              onCreate={handleCreate}
              isPending={createMutation.isPending}
            />
          )}
        </Modal>
      )}
      {isLoading && <p>Завантаження постів...</p>}
      {isError && <p>Помилка завантаження постів.</p>}
      {posts.length > 0 && (
        <PostList posts={posts} toggleEditPost={handleEdit} onDelete={handleDelete} />
      )}
      {posts.length === 0 && !isLoading && <p>Постів не знайдено.</p>}
    </div>
  );
}
