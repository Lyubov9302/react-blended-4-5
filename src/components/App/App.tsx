import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["posts", debouncedSetSearchValue, currentPage],
    queryFn: () => fetchPosts(debouncedSetSearchValue, currentPage),
    placeholderData: keepPreviousData,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEdit = (post: Post) => {
    setPostToEdit(post);
  };

  const handleCreate = (newPost: Post) => {
    createMutation.mutate(newPost);
    toggleModal();
  };

  const perPage = 8;
  const totalPages = data ? Math.ceil(data.totalCount / perPage) : 0;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchValue} onSearch={handleSearch} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
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
        {data !== undefined && data?.posts?.length > 0 && (
          <PostList
            posts={data.posts}
            toggleEditPost={handleEdit}
            toggleModal={() => toggleModal()}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}
