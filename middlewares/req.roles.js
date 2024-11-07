const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { roles } = require('../config/roles');
const ApiError = require("../utils/ApiError");


const roleRouteMap = {create: [roles.ADMIN, roles.CREATOR],
    search: [roles.ADMIN, roles.CREATOR, roles.GUEST, roles.LEARNER],
    update: [roles.CREATOR, roles.ADMIN],
    learner: [roles.ADMIN, roles.LEARNER],
    learnerNcreator: [roles.ADMIN, roles.LEARNER, roles.CREATOR]
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