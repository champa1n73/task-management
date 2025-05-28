import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Login from "./Login";

// Mock react-redux hooks
import * as reactRedux from "react-redux";
const useDispatchMock = vi.fn();
const useSelectorMock = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => useDispatchMock,
  useSelector: (fn) => useSelectorMock(fn),
}));

// Mock react-router-dom Navigate component to avoid actual navigation
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  Navigate: ({ to }) => <div>Redirected to {to}</div>,
  Link: ({ children }) => <span>{children}</span>,
}));

// Mock loginUser action
vi.mock("../../utils/slices/authSlice", () => ({
  loginUser: (form) => ({ type: "LOGIN_USER", payload: form }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
    // Clear localStorage mock
    localStorage.clear();
  });

  test("renders login form elements", () => {
    useSelectorMock.mockReturnValue({ loading: false, error: null });
    render(<Login />);
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("redirects to '/' if token exists in localStorage", () => {
    useSelectorMock.mockReturnValue({ loading: false, error: null });
    localStorage.setItem("token", "dummy_token");
    render(<Login />);
    expect(screen.getByText(/Redirected to \//i)).toBeInTheDocument();
  });

  test("dispatches loginUser action with form data on submit", () => {
    useSelectorMock.mockReturnValue({ loading: false, error: null });
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(useDispatchMock).toHaveBeenCalled();
    // You can check if dispatch was called with correct action if needed
    expect(useDispatchMock.mock.calls[0][0]).toEqual({
      type: "LOGIN_USER",
      payload: { email: "test@example.com", password: "password123" },
    });
  });

  test("shows loading text when loading is true", () => {
    useSelectorMock.mockReturnValue({ loading: true, error: null });
    render(<Login />);
    expect(screen.getByRole("button", { name: /logging in/i })).toBeInTheDocument();
  });

  test("shows error message if error exists", () => {
    const error = { message: "Invalid credentials" };
    useSelectorMock.mockReturnValue({ loading: false, error });
    render(<Login />);
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
