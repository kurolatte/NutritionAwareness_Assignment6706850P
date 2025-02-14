const Joi = require("joi");

const validateFood = (req, res, next) => {
    const schema = Joi.object({
        foodName: Joi.string().min(3).max(100).required(),
        nutritionalInfo: Joi.string().min(5).max(500).required(),
        dietaryRestrictions: Joi.string().min(3).max(200).required(),
        suitableForElderly: Joi.boolean().optional(),
        additionalNotes: Joi.string().max(500).optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ message: "Validation error", errors });
    }

    next();
};

module.exports = validateFood;
