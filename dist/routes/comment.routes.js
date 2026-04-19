"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_js_1 = __importDefault(require("../controllers/comment.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const comment_validator_js_1 = require("../validators/comment.validator.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
router.post("/:taskId", (0, validate_js_1.default)(comment_validator_js_1.addCommentSchema), comment_controller_js_1.default.addComment);
router.get("/:taskId", comment_controller_js_1.default.getComments);
exports.default = router;
