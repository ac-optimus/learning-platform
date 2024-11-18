const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

const LOGIN_SERVICE_DNS = config.loginservice.url;
const LOGIN_SERVICE_ROOT = config.loginservice.baseurl;
const ADMIN_EMAIL = config.admin.email;
const ADMIN_PASSWORD = config.admin.password;

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
      let user = await isAuthUser(token);
      let rolesCheck = intersection(new Set(user.roles), new Set(req.requiredRoles));
      if (rolesCheck.size == 0)
        throw new ApiError(httpStatus.UNAUTHORIZED, "User Dont have required access")
      req.user = user
  } catch (error) {
      console.log(error)
      throw error
  }
  return next()
});

function intersection(setA, setB) {
    const resultSet = new Set();
    for (let item of setA) {
        if (setB.has(item)) {
            resultSet.add(item);
        }
    }
    return resultSet;
  }

const authenicateAdmin =catchAsync(async () => {
    console.log(ADMIN_EMAIL, ADMIN_PASSWORD)
    const loginResponse = await fetch(`${LOGIN_SERVICE_ROOT}/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        })
    });

    if (loginResponse.status==401) {
        registerAdmin()
    } else {
        console.log('Admin already registerd')
    }
});


const registerAdmin = async () => {
    const registrationResponse = await fetch(`${LOGIN_SERVICE_ROOT}/v1/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            name: "admin",
            roles: ["admin", "creator", "learner"]
        })
    });
    if (!registrationResponse.ok) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Can not register admin');
    }
    console.log('Admin registered');
}


module.exports = {
    auth,
    authenicateAdmin
};