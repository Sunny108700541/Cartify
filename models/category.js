const mongoose = require("mongoose");
const Joi = require("joi");

// Category Schema
const categorySchema =  mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        minlength: 2, 
        maxlength: 50 
    }
}, { timestamps: true });

// Joi Validation Function
const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
    });

    return schema.validate(data);
};

// Export Model and Validator
module.exports = {
    categoryModel: mongoose.model("Category", categorySchema),
    validateCategory
};
