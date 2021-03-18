import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import HelloWorldApi from "./HelloWorldApi";
import TransactionDetail from "./TransactionDetail";
import { BrowserRouter as Router } from "react-router-dom";

const server = setupServer(
  rest.get("/jsFrameworks.json", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          email: "divya.mittal@gmail.com",
          url: "http://localhost:8000/getTransactionFromUser",
        },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays list of JavaScript frameworks", async () => {
  render(<TransactionDetail />);
  await waitFor(() => screen.getByText(/divya.mittal/i));
  expect(screen.getByText("divya.mittal@gmail.com").href).toBe(
    "http://localhost:8000/getTransactionFromUser"
  );
});
