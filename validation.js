const joi = require('joi');

const detailsSchema = joi.object({
    amount_payable:joi.number().required(),
    amount:joi.number().required(),
    entities:joi.object({
        restaurant:joi.object({
            name:joi.string().required(),
            acc_number:joi.string().required(),
            percentage:joi.number().min(0).max(1).required()
        }),
        driver:joi.object({
            name:joi.string().required(),
            acc_number:joi.string().required(),
            percentage:joi.number().min(0).max(1).required()
        }),
        company:joi.object({
            name:joi.string().required(),
            acc_number:joi.string().required(),
            percentage:joi.number().min(0).max(1).required()
        })
    })
});

module.exports = detailsSchema;