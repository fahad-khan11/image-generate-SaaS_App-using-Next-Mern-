const mongoose = require('mongoose');

let isConnected = false; 
const connect_DB = async () => {
    try {
        if (isConnected) {
            console.log('Already connected to the database');
            return;
        }
        await mongoose.connect(`${process.env.MONGO_URI}/SAAS-APP`);
        isConnected = true;
        console.log('DB connected successfully...');
        
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1); 
    }
};

module.exports = connect_DB;
