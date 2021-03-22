import { render, screen, fireEvent } from "@testing-library/react";
import CreateGroup from "./CreateGroupComponent";
import { BrowserRouter as Router } from "react-router-dom";

test("Login Box", () => {
  render(
    <Router createGroup={CreateGroup}>
      <CreateGroup />
    </Router>
  );
  const inputBox = screen.getByTestId("groupName-input-box");
  fireEvent.change(inputBox, { target: { value: "Group Divya" } });
  expect(inputBox.value).toBe("Group Divya");
});
