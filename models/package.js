const mongoose = require('mongoose');

let packageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    packageId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        validate: {
            validator: (titleValue) => {
                let regex = /^[a-z0-9 ]+$/i;
                return titleValue.length >= 3 && titleValue.length <= 15 && regex.test(titleValue);
            },
            message: "Title must be alphanumeric with length between 3 and 15 characters (inclusive)"
        }
    },
    weight: {
        type: Number,
        required: true,
        validate: {
            validator: (weightValue) => {
                return !isNaN(weightValue) && weightValue > 0;
            },
            message: "Weight must be a positive number"
        }
    },
    destination: {
        type: String,
        required: true,
        validate: {
            validator: (destinationValue) => {
                let regex = /^[a-z0-9 ]+$/i;
                return destinationValue.length >= 5 && destinationValue.length <= 15 && regex.test(destinationValue);
            },
            message: "Destination must be alphanumeric with length between 5 and 15 characters (inclusive)"
        }
    },
    description: {
        type: String,
        required: false,
        validate: {
            validator: (descriptionValue) => {
                let regex = /^.{0,30}$/;
                return regex.test(descriptionValue);
            },
            message: "Package description can be a string of any type, within 30 characters"
        }
    },
    isAllocated: {
        type: Boolean,
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Package", packageSchema);
