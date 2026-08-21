// Wraps an async route handler so thrown errors/rejected promises
// are passed to Express's error middleware instead of crashing the process.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
