// libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";
// types
import { Post } from "../../types/post";
// styles
import css from "./PostList.module.css";
// services
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
}

export default function PostList({ posts, toggleModal, toggleEditPost }: PostListProps) {
  const queryClient = useQueryClient();

  const deletePostMutate = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post deleted successfully!");
    },
  });

  function onDeletePost(id: number) {
    deletePostMutate.mutate(id);
  }

  return (
    <ul className={css.list}>
      {posts.map((post) => {
        return (
          <li className={css.listItem} key={post.id}>
            <h2 className={css.title}>{post.title}</h2>
            <p className={css.content}>{post.body}</p>
            <div className={css.footer}>
              <button
                onClick={() => {
                  toggleEditPost(post);
                  toggleModal();
                }}
                className={css.edit}
              >
                Edit
              </button>
              <button onClick={() => onDeletePost(post.id)} className={css.delete}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
