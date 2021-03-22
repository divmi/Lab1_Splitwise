import { render, screen, fireEvent } from "@testing-library/react";
import UpdateProfile from "./UpdateProfile";
import { BrowserRouter as Router } from "react-router-dom";

test("Login Box", () => {
  render(
    <Router uprofile={UpdateProfile}>
      <UpdateProfile />
    </Router>
  );
  const inputBox = screen.getByTestId("Name-input-box");
  fireEvent.change(inputBox, { target: { value: "Divya" } });
  expect(inputBox.value).toBe("Divya");
});
