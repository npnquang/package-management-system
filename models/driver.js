const mongoose = require('mongoose');

let driverSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    driverId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        validate: {
            validator: (nameValue) => {
                let regex = /^[a-zA-Z ]+$/;
                return nameValue.length >= 3 && nameValue.length <= 20 && regex.test(nameValue);
            },
            message: "Name must be alphabetical string with length between 3 and 20 characters (inclusive)"
        }
    },
    department: {
        type: String,
        required: true,
        validate: {
            validator: (departmentValue) => {
                let departments = ["electronic", "food", "furniture"]
                return departments.includes(departmentValue);
            },
            message: "Department must be either eletronic, food or furniture"
        }
    },
    licence: {
        type: String,
        required: true,
        validate: {
            validator: (licenseValue) => {
                let regex = /^[a-z0-9]+$/i;
                return regex.test(licenseValue) && licenseValue.length == 5;
            },
            message: "Driver license must be alphanumeric with length of 5 characters"
        }
    },
    isActive: {
        type: Boolean,
        required: true
    },
    assigned_packages: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Package"}
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Driver", driverSchema);