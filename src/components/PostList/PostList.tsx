import css from "./PostList.module.css";
import { Post } from "../../types/post";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostList({ posts, toggleEditPost, toggleModal, onDelete }: PostListProps) {
  const handleEditPost = (post: Post) => {
    toggleModal();
    toggleEditPost(post);
  };

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => handleEditPost(post)}>
              Edit
            </button>
            <button className={css.delete} onClick={() => onDelete(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
