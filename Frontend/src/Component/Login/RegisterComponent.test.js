import { render, screen, fireEvent } from "@testing-library/react";
import Register from "./RegisterComponent";
import { BrowserRouter as Router } from "react-router-dom";

test("Register Box", () => {
  render(
    <Router register={Register}>
      <Register />
    </Router>
  );
  const inputBox = screen.getByTestId("email-input-box");
  fireEvent.change(inputBox, { target: { value: "divyamittal@gmail.com" } });
  expect(inputBox.value).toBe("divyamittal@gmail.com");
});
