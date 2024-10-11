const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

const LOGIN_SERVICE_DNS = config.loginservice.url;

const isAuthUser = async (token) => {
  try {
    const response = await fetch(LOGIN_SERVICE_DNS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        });
    if (!response.ok) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Please Authenticate");
        }
    return await response.json();
    } catch (error) {
        throw error
    }
}

const auth = catchAsync(async (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      let user = await isAuthUser(token, req.requiredRoles);
      let rolesCheck = (new Set(user.roles)).intersection(new Set(req.requiredRoles));
      if (rolesCheck.size == 0)
        throw new ApiError(httpStatus.UNAUTHORIZED, "User Dont have required access")
      req.user = user
  } catch (error) {
      console.log(error)
      throw error
  }
  return next()
});


module.exports = auth;