const mongoose = require("mongoose");
const firebaseConfig = require("../config");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

/**
 * This function connects the app to the database
 * @param {string} mode - either 'letters' or 'numbers'
 * @param {int} len - length of the generated strings
 */
async function connectDB() {
    
    const URL = "mongodb://localhost:27017/FIT2095_A2";
	try {
        await mongoose.connect(URL);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

/**
 * This function create a random string containing based on the requirements
 * @param {string} mode - either 'letters' or 'numbers'
 * @param {int} len - length of the generated strings
 * 
 * @returns {string} 
 */
function generateRandomString(mode, len) {
    let characters = "";
    if (mode === "letters") {
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (mode === "numbers") {
        characters = '0123456789';
    } else {
        return "";
    }
    let result = '';
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = {
    connectDB,
    generateRandomString,
    db,
    auth
}