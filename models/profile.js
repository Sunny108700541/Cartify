const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    savedAddress: { 
        type: {
            name: String,
            phone: String,
            address: String,
            pincode: String
        }, 
        required: true 
    },
    orders: [{
        productName: String,
        quantity: Number,
        amount: Number,
        date: { type: Date, default: Date.now }
    }]
});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
