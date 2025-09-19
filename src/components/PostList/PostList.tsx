import css from "./PostList.module.css";
import { Post } from "../../types/post";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PostList({ posts, toggleEditPost, onDelete }: PostListProps) {
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => toggleEditPost(post.id)}>
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
