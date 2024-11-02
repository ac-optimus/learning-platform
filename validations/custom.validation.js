const QuestionType = require('../enums/questiontype');
const { CourseCategory } = require('../enums/courseCategory');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('invaid {{#label}} passed');
  }
  return value;
};

const questionType = (value, helpers) => {
  if (!Object.values(QuestionType).includes(value)) { 
    return helpers.message('invaid {{#label}} passed');
  }
  return value;
};

const courseCategory = (value, helpers) => {
  if (!Object.values(CourseCategory).includes(value.toUpperCase())) { 
    return helpers.message(`invaid {{#label}} passed, valid categories are ${Object.values(CourseCategory).join(', ')}`);
  }
  return value.toUpperCase();
};


module.exports = {
  objectId,
  questionType,
  courseCategory
};