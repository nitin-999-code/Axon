import { Response } from "express";

/**
 * Standardized API response wrapper.
 * Every response from the API follows this structure for consistency.
 */
class ApiResponse {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: any;
  public readonly timestamp: string;

  constructor(statusCode: number, message: string, data: any = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /** Send the response via Express res object */
  public send(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    });
  }

  // ─── Factory Methods ─────────────────────────

  static ok(res: Response, message: string = "Success", data: any = null): Response {
    return new ApiResponse(200, message, data).send(res);
  }

  static created(res: Response, message: string = "Resource created", data: any = null): Response {
    return new ApiResponse(201, message, data).send(res);
  }

  static noContent(res: Response, message: string = "No content"): Response {
    return new ApiResponse(204, message).send(res);
  }
}

export default ApiResponse;
