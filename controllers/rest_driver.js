const express = require("express"); // express app
const { default: mongoose } = require("mongoose");
const Driver = require("../models/driver"); // Driver class
const Package = require("../models/package");
const { connectDB, generateRandomString } = require("../utils/utils");
const { increaseOperation } = require("./crud_operations");

connectDB();

let router = express.Router();

router.use(express.urlencoded({extended: true}));
router.use(express.json());

async function getDrivers(req, res) {
    let drivers = await Driver.find({}).populate("assigned_packages").exec();
    increaseOperation("read");
    return res.status(200).json(drivers);
}
router.get("/", getDrivers);

async function insertDriver(req, res) {
    let id = new mongoose.Types.ObjectId();
    let driverId = "D" + parseInt(Math.random() * 100) + "-32-" + generateRandomString("letters", 3);
    let newDriver = new Driver({
        _id: id,
        driverId,
        name: req.body.driver_name,
        department: req.body.driver_department,
        licence: req.body.driver_licence,
        isActive: req.body.driver_isActive ? true : false
    });
    try {
        await newDriver.save();
        increaseOperation("create");
        return res.status(200).json({
            id,
            driver_id: driverId
        });
    } catch (err) {
        return res.status(400).json({
            status: err.message
        });
    }
}
router.post("/add", insertDriver);


async function deleteDriver(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
        return res.status(400).json({
            status: "ID not found"
        });
    };

    let id = new mongoose.Types.ObjectId(req.query.id);
    
    let packages = await Driver.findOne(
        {
            _id: id
        }
    ).select("assigned_packages").populate("assigned_packages").exec();
    
    if (!packages) {
        return res.status(400).json({
            status: "ID not found"
        });
    }
    
    packages = packages["assigned_packages"];
    packages.map(
        async (item) => {
            await Package.deleteOne({
                _id: item._id
            })
            increaseOperation("delete");
        }
    );

    let result = await Driver.deleteOne({
        _id: id
    });
    increaseOperation("delete");
    
    return res.status(200).json(result);
}
router.delete("/delete", deleteDriver);


async function updateDriver(req, res) {
    let { id, driver_licence, driver_department } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "ID not found"
        });
    }
    
    id = new mongoose.Types.ObjectId(id);

    let updateData = {}
    if (driver_licence) {
        updateData["licence"] = driver_licence;
    }
    if (driver_department) {
        updateData["department"] = driver_department;
    }
    
    let result = await Driver.updateOne(
        {
            _id: id
        },
        updateData
    );
    
    if (result.modifiedCount === 0) {
        return res.status(400).json({
            status: "ID not found or no changes were made"
        });
    }

    increaseOperation("update");
    return res.status(200).json({
        status: "Driver updated successfully"
    });
    
}
router.put("/update", updateDriver);



module.exports = router;