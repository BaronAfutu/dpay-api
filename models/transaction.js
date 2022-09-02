const mongoose = require('../db');


var TransactionSchema = mongoose.Schema({
    transaction_id: String,
    order_id:String,
    amount: Number,
    payment:{
        restaurant:{
            name:String,
            amount: Number,
            acc_number: String,
            transaction_id: String
        },
        driver:{
            name:String,
            amount: Number,
            acc_number: String,
            transaction_id: String
        },
        company:{
            name:String,
            amount: Number,
            acc_number: String,
            transaction_id: String
        },
    },
    created_at:{type: Date, default:Date.now()},
    updated_at:{type: Date, default:Date.now()}
});

var Transaction = mongoose.model("Transaction",TransactionSchema);

module.exports = Transaction;