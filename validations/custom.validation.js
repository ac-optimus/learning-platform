const QuestionType = require('../enums/questiontype');

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


module.exports = {
  objectId,
  questionType
};