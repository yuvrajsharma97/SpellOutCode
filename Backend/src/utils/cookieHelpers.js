const IS_PROD = process.env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "none" : "strict",
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", BASE_COOKIE_OPTIONS);
  res.clearCookie("refreshToken", BASE_COOKIE_OPTIONS);
};

module.exports = { setAuthCookies, clearAuthCookies };
