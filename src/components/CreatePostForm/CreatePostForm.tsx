import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { Post } from "../../types/post";

interface CreatePostFormProps {
  onClose: () => void;
  onCreate: (newPost: Post) => void;
  isPending: boolean;
}

interface FormData {
  title: string;
  content: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Заголовок обов'язковий.")
    .min(3, "Заголовок повинен містити щонайменше 3 символи.")
    .max(50, "Заголовок повинен містити не більше 50 символів."),
  content: Yup.string()
    .required("Текст поста обов'язковий.")
    .max(500, "Текст поста повинен містити не більше 500 символів."),
});

const initialValues: FormData = {
  title: "",
  content: "",
};

export default function CreatePostForm({ onClose, onCreate, isPending }: CreatePostFormProps) {
  const onSubmit = (values: FormData) => {
    onCreate(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Заголовок</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Текст</label>
            <Field id="content" as="textarea" name="content" rows="8" className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className={css.submitButton} disabled={isPending || isSubmitting}>
              {isPending ? "Створення..." : "Створити пост"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
