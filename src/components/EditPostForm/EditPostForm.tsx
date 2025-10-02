// styles
import css from "./EditPostForm.module.css";
// types
import { FormData } from "../../types/formData";
import { Post, UpdateDataPost } from "../../types/post";
// services
import { editPost } from "../../services/postService";
// libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

interface EditPostFormProps {
  onClose: () => void;
  selectedPost: Post;
}

const OrderSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

export default function EditPostForm({ onClose, selectedPost }: EditPostFormProps) {
  const queryClient = useQueryClient();

  const defaultValue: FormData = {
    title: selectedPost.title,
    body: selectedPost.body,
  };

  const editPostMutate = useMutation({
    mutationFn: (newPost: UpdateDataPost) => editPost(newPost),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post edited successfully!");
      onClose();
    },
  });

  function handleSubmit(values: FormData, formikHelpers: FormikHelpers<FormData>) {
    const newPost: UpdateDataPost = {
      ...values,
      id: selectedPost.id,
    };

    editPostMutate.mutate(newPost, {
      onSuccess: () => formikHelpers.resetForm(),
    });
  }

  return (
    <Formik initialValues={defaultValue} onSubmit={handleSubmit} validationSchema={OrderSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={editPostMutate.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
