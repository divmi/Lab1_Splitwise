import { render, screen, fireEvent } from "@testing-library/react";
import MyGroup from "./MyGroup";
import { BrowserRouter as Router } from "react-router-dom";

test("Group Info", () => {
  render(
    <Router mygroup={MyGroup}>
      <MyGroup />
    </Router>
  );
  const inputBox = screen.getByTestId("search-input-box");
  fireEvent.change(inputBox, { target: { value: "Group Divya" } });
  expect(inputBox.value).toBe("Group Divya");
});
