/**
 * Wraps async route handlers to catch rejected promises automatically.
 * Eliminates try/catch boilerplate in every controller method.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
