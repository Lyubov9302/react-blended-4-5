// styles
import css from "./CreatePostForm.module.css";
// types
import { FormData } from "../../types/formData";
// services
import { createPost } from "../../services/postService";
// libraries
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostFormProps {
  onClose: () => void;
}

const defaultValue: FormData = {
  title: "",
  body: "",
};

const OrderSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

export default function CreatePostForm({ onClose }: CreatePostFormProps) {
  const queryClient = useQueryClient();

  const createNewPost = useMutation({
    mutationFn: (newPost: FormData) => createPost(newPost),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post created successfully!");
      onClose();
    },
  });

  function handleSubmit(values: FormData, formikHelpers: FormikHelpers<FormData>) {
    createNewPost.mutate(values, {
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
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={createNewPost.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
