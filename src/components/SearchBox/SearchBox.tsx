// styles
import css from "./SearchBox.module.css";
// libraries
import { ChangeEvent } from "react";
import { DebouncedState } from "use-debounce";

interface SearchBoxProps {
  value: string;
  onSearch: DebouncedState<(value: string) => void>;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onSearch(event.target.value);
  }

  return (
    <input
      onChange={handleChange}
      defaultValue={value}
      className={css.input}
      type="text"
      placeholder="Search posts"
    />
  );
}
