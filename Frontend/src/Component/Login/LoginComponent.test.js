import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./LoginComponent";
import { BrowserRouter as Router } from "react-router-dom";

test("Login Box", () => {
  render(
    <Router login={Login}>
      <Login />
    </Router>
  );
  const inputBox = screen.getByTestId("email-input-box");
  fireEvent.change(inputBox, { target: { value: "divyamittal@gmail.com" } });
  expect(inputBox.value).toBe("divyamittal@gmail.com");
});
