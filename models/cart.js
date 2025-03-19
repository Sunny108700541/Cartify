const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Schema
const cartSchema =  mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    ],
    totalPrice: { 
        type: Number, 
        required: true, 
        min: 0 
    }
}, { timestamps: true });

// Joi Validation Function
const validateCart = (data) => {
    const schema = Joi.object({
        user: Joi.string().hex().length(24).required(), // Ensures valid MongoDB ObjectId
        products: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
        totalPrice: Joi.number().min(0).required()
    });

    return schema.validate(data);
};

// Export Model and Validator
module.exports = {
    cartModel: mongoose.model("Cart", cartSchema),
    validateCart
};
