const request = require("supertest");
const app = require("../../app/app");


// Mock auth middleware to bypass real token validation for testing
jest.mock("../../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { id: "testUserId" }; // mock user info
  next();
});

// Mock controller methods for isolated testing if needed
jest.mock("../../controllers/auth.controller", () => ({
  register: (req, res) => res.status(201).json({ message: "User registered" }),
  login: (req, res) => res.status(200).json({ token: "fake-jwt-token" }),
  forgotPassword: (req, res) => res.status(200).json({ message: "Email sent" }),
  resetPassword: (req, res) => res.status(200).json({ message: "Password reset" }),
}));

jest.mock("../../controllers/users.controller", () => ({
  profile: (req, res) => res.status(200).json({ user: { id: req.user.id, name: "Test User" } }),
  updateProfile: (req, res) => res.status(200).json({ message: "Profile updated" }),
}));

describe("Users Router", () => {
  it("POST /auth/register should register user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "test", email: "test@example.com", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered");
  });

  it("POST /auth/login should login user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("fake-jwt-token");
  });

  it("GET /auth/profile should return user profile (auth required)", async () => {
    const res = await request(app).get("/auth/profile");
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual({ id: "testUserId", name: "Test User" });
  });

  it("PUT /auth/profile should update profile (auth required)", async () => {
    const res = await request(app)
      .put("/auth/profile")
      .send({ name: "New Name" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Profile updated");
  });

  it("POST /auth/forgot-password should send reset email", async () => {
    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "test@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Email sent");
  });

  it("POST /auth/reset-password should reset password", async () => {
    const res = await request(app)
      .post("/auth/reset-password")
      .send({ token: "reset-token", password: "newpassword" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password reset");
  });
});
