const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync").default;
const { roles } = require('../config/roles');
const ApiError = require("../utils/ApiError").default;


const roleRouteMap = {create: [roles.ADMIN, roles.CREATOR],
    search: [roles.ADMIN, roles.CREATOR, roles.GUEST, roles.LEARNER],
    update: [roles.CREATOR, roles.ADMIN]
}

const requiredRoles = (rolesKey) => catchAsync(async (req, res, next) => {
    if (roleRouteMap.hasOwnProperty(rolesKey)) {
        req.requiredRoles = roleRouteMap[rolesKey]
    } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Route not mapped to a role");
    }
  return next()
});


module.exports = requiredRoles;