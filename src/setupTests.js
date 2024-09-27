// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "./mocks/server.js";
import * as rtl from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutForm from "./components/CheckoutForm";

// MSW
// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
test("Checkout form renders without any errors", async () => {
  expect(rtl.render(<CheckoutForm></CheckoutForm>)).toBeTruthy();
});
test("When all inputs are filled out and the form submitted a success banner appears", async () => {
  rtl.render(<CheckoutForm></CheckoutForm>);
  const firstName = rtl.screen.getByLabelText(/first name:/i);
  const lastName = rtl.screen.getByLabelText(/last name:/i);
  const address = rtl.screen.getByLabelText(/address:/i);
  const city = rtl.screen.getByLabelText(/city:/i);
  const state = rtl.screen.getByLabelText(/state:/i);
  const zip = rtl.screen.getByLabelText(/zip:/i);
  const submitButton = rtl.screen.getByRole("button", { name: /checkout/i });

  userEvent.type(firstName, "Jupon");
  userEvent.type(lastName, "Gatana");
  userEvent.type(address, "123 Fake St");
  userEvent.type(city, "Fake Land");
  userEvent.type(state, "FakeState");
  userEvent.type(zip, "12345");
  userEvent.click(submitButton);

  expect(rtl.screen.queryByText(/you have ordered some plants!/i)).toBeTruthy();
  expect(rtl.screen.queryByText(/fake land, FakeState 12345/i)).toBeTruthy();
});

// Clean up after the tests are finished.
afterAll(() => server.close());
