require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://ronny73:${process.env.DB_PASSWORD}@bclouds-cluster.skjrr.mongodb.net/dPay`,//);
{useNewUrlParser: true },function(err){
    if(err) {
        console.log('Some problem with the connection ' +err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});

module.exports = mongoose;