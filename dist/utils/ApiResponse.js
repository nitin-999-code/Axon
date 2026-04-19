"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Standardized API response wrapper.
 * Every response from the API follows this structure for consistency.
 */
class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }
    /** Send the response via Express res object */
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp,
        });
    }
    // ─── Factory Methods ─────────────────────────
    static ok(res, message = "Success", data = null) {
        return new ApiResponse(200, message, data).send(res);
    }
    static created(res, message = "Resource created", data = null) {
        return new ApiResponse(201, message, data).send(res);
    }
    static noContent(res, message = "No content") {
        return new ApiResponse(204, message).send(res);
    }
}
exports.default = ApiResponse;
