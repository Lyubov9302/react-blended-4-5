// components
import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";
// styles
import css from "./App.module.css";
// services
import { fetchPosts } from "../../services/postService";
// types
import { Post } from "../../types/post";
// libraries
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const { data, isSuccess } = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = Math.ceil(Number(data?.totalPosts) / 8) || 0;

  function modalOpen(formType: string) {
    setIsModalOpen(true);

    if (formType === "create") {
      setIsCreatePost(true);
    }

    if (formType === "edit") {
      setIsEditPost(true);
    }
  }

  function modalClose() {
    setIsModalOpen(false);

    if (isCreatePost) {
      setIsCreatePost(false);
    }

    if (isEditPost) {
      setIsEditPost(false);
      setEditedPost(null);
    }
  }

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={handleSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => modalOpen("create")} className={css.button}>
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={modalClose}>
          {isCreatePost && <CreatePostForm onClose={modalClose} />}
          {isEditPost && <EditPostForm onClose={modalClose} selectedPost={editedPost as Post} />}
        </Modal>
      )}
      {data && (
        <PostList
          posts={data.posts}
          toggleModal={() => modalOpen("edit")}
          toggleEditPost={setEditedPost}
        />
      )}
    </div>
  );
}
