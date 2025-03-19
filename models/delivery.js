const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery Schema
const deliverySchema =  mongoose.Schema({
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    deliveryBoy: { 
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 50 
    },
    status: { 
        type: String, 
        enum: ["pending", "out for delivery", "delivered", "canceled"], 
        default: "pending",
        required: true
    },
    trackingURL: { 
        type: String, 
        required: true, 
        match: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\/\w .-]*)*\/?$/ 
    },
    estimatedDeliveryTime: { 
        type: Number, 
        required: true, 
        min: 1 
    }
}, { timestamps: true });

// Joi Validation Function
const validateDelivery = (data) => {
    const schema = Joi.object({
        order: Joi.string().hex().length(24).required(), // Ensures valid MongoDB ObjectId
        deliveryBoy: Joi.string().min(3).max(50).required(),
        status: Joi.string().valid("pending", "out for delivery", "delivered", "canceled").required(),
        trackingURL: Joi.string().uri(),
        estimatedDeliveryTime: Joi.number().min(1).required()
    });

    return schema.validate(data);
};

// Export Model and Validator
module.exports = {
    deliveryModel: mongoose.model("Delivery", deliverySchema),
    validateDelivery
};
