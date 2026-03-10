import authService from "../services/auth.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Auth Controller — handles registration, login, and profile endpoints.
 */
class AuthController {
  /**
   * POST /api/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const ipAddress = req.ip;
    const result = await authService.register(req.body, ipAddress);

    // Set token in httpOnly cookie
    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return ApiResponse.created(res, "User registered successfully", result);
  });

  /**
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const ipAddress = req.ip;
    const result = await authService.login(req.body, ipAddress);

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.ok(res, "Login successful", result);
  });

  /**
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (_req, res) => {
    res.clearCookie("accessToken");
    return ApiResponse.ok(res, "Logged out successfully");
  });

  /**
   * GET /api/auth/me
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    return ApiResponse.ok(res, "Profile retrieved", user);
  });
}

export default new AuthController();
