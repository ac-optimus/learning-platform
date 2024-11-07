const Joi = require('joi');
const { objectId } = require('./custom.validation');


const enrollLearner = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        paymentToken: Joi.string()
    })
}

const unenrollLearner = {
    params: Joi.object().keys({
        courseId: Joi.string().required().custom(objectId)
    })
}


module.exports = {
    enrollLearner,
    unenrollLearner
};
    