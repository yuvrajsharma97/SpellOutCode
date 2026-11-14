/**
 * Read ?page and ?limit from a query string. Every list endpoint is bounded:
 * at most MAX_LIMIT items per response.
 */
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 100;

const toPositiveInt = (value, fallback) => {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const parsePagination = (query = {}) => {
  const page = Math.min(toPositiveInt(query.page, 1), 10000);
  const limit = Math.min(toPositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
};

const paginationMeta = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  hasMore: page * limit < total,
});

module.exports = { parsePagination, paginationMeta };
