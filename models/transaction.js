const mongoose = require('../db');


var TransactionSchema = mongoose.Schema({
    transaction_id: String,
    order_id:String,
    amount: Number,
    payment:{
        restaurant:Object,
        driver:Object,
        company:Object,
    },
    created_at:{type: Date, default:Date.now()},
    updated_at:{type: Date, default:Date.now()}
});

var Transaction = mongoose.model("Transaction",TransactionSchema);

module.exports = Transaction;