const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Schema
const paymentSchema = mongoose.Schema({
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    method: { 
        type: String, 
        enum: ["credit card", "debit card", "UPI", "net banking", "cash on delivery"], 
        required: true 
    },
    status: { 
        type: String, 
        
        required: true
    },
    transactionID: { 
        type: String, 
        required: true, 
        unique: true 
    }
}, { timestamps: true });

// Joi Validation Function
const validatePayment = (data) => {
    const schema = Joi.object({
        order: Joi.string().hex().length(24).required(), // Ensures valid MongoDB ObjectId
        amount: Joi.number().min(0).required(),
        method: Joi.string().required(),
        status: Joi.string().required(),
        transactionID: Joi.string().required()
    });

    return schema.validate(data);
};

// Export Model and Validator
module.exports = {
    paymentModel: mongoose.model("Payment", paymentSchema),
    validatePayment
};
