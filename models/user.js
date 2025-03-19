const mongoose = require('mongoose');
const Joi = require('joi');

// Address Schema
const AddressSchema =  mongoose.Schema({
    state: { type: String, required: true },
    zip: { type: Number, required: true },
    city: { type: String, required: true }
});

// User Schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 50 },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 
        },
        password: { type: String,  minlength: 6 },
        phone: { type: Number,  min: 1000000000, max: 9999999999 },
        addresses: { type: [AddressSchema], }
    },
    { timestamps: true }
);

// Joi Validation Function
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.number().integer().min(1000000000).max(9999999999),
        addresses: Joi.array().items(
            Joi.object({
                state: Joi.string().required(),
                zip: Joi.number().required(),
                city: Joi.string().required(),
            })
        ),
    });

    return schema.validate(data);
};

// Export Model and Validator
module.exports = {
    userModel: mongoose.model("User", userSchema),
    validateUser
};
