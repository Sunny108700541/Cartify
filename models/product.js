const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema
const productSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        minlength: 2, 
        maxlength: 100 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    category: { 
        type: String, 
        required: true, 
        minlength: 2, 
        maxlength: 50 
    },
    stock: { 
        type: Boolean, 
        default: true 
    },
    description: { 
        type: String, 
        
    },
    image: {
        
        type: String, 
        required: true,
    }
}, { timestamps: true });

// Joi Validation Function
const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(2).max(50).required(),
        stock: Joi.boolean(),
        description: Joi.string().min(10).max(1000).required(),
        image: Joi.string().uri().optional(),
    });

    return schema.validate(data);
};

// Export Model and Validator
module.exports = {
    productModel: mongoose.model("Product", productSchema),
    validateProduct
};
