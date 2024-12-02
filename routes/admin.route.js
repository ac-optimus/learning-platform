const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');
const { Course, Chapter, CourseEnroll, Question, Quiz, Solution, Submission, Commission } = require("../models");
const config = require("../config/config");

const ADMIN_EMAIL = config.admin.email;
const ADMIN_PASSWORD = config.admin.password;

AdminJS.registerAdapter(AdminJSMongoose);

// Initialize AdminJS
const adminJs = new AdminJS({
  resources: [
    { resource: Course,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
    { resource: Chapter,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
    { resource: CourseEnroll,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
    { resource: Question,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
    { resource: Quiz,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
    { resource: Solution,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
    { resource: Submission,
      options: {
        actions: {
          delete: {
            isAccessible: false, // This disables the delete action
          },
        },
      },
    },
  ],
  rootPath: '/admin',
});
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  },
  cookiePassword: 'sessionKey',
});


module.exports = { adminRouter };