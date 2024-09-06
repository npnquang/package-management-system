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

async function getPackage(req, res) {
    let packages = await Package.find({}).populate("driverId").exec();
    increaseOperation("read")
    return res.status(200).json(packages);
}
router.get("/", getPackage);

async function insertPackage(req, res) {
    let id = new mongoose.Types.ObjectId();
    let packageId = "P" + generateRandomString("letters", 2) + "-JN-" + generateRandomString("numbers", 3);
    
    let driverId = new mongoose.Types.ObjectId(req.body.driver_id);

    let newPackage = new Package({
        _id: id,
        packageId,
        title: req.body.package_title,
        weight: req.body.package_weight,
        destination: req.body.package_destination,
        isAllocated: req.body.isAllocated ? true : false,
        driverId: driverId,
        ...(req.body.package_description && { description: req.body.package_description })
    });

    try {
        await newPackage.save();
        await Driver.updateOne(
            {
                _id: driverId
            },
            {
                $push: {
                    assigned_packages: newPackage._id
                }
            }
        );
        increaseOperation("create");
        return res.status(200).json({
            id,
            package_id: packageId
        });
    } catch (err) {
        return res.status(400).json({
            status: err.message
        });
    }
}
router.post("/add", insertPackage);


async function deletePackage(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
        return res.status(400).json({
            status: "ID not found"
        });
    };

    let id = new mongoose.Types.ObjectId(req.query.id);
    let result = await Package.findOne({
        _id: id
    });

    if (!result) {
        return res.status(400).json({
            status: "ID not found"
        });
    }
    
    let driverId = result.driverId;
    await Driver.updateOne(
        {
            _id: driverId
        },
        {
            "$pull": {
                "assigned_packages": id
            }
        }
    );

    result = await Package.deleteOne({
        _id: id
    });
    
    increaseOperation("delete");
    return res.status(200).json(result);
}
router.delete("/delete", deletePackage);


async function updatePackage(req, res) {
    let { id, package_destination } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "ID not found"
        });
    }
    
    id = new mongoose.Types.ObjectId(id);

    let updateData = {}
    if (package_destination) {
        updateData["destination"] = package_destination;
    }

    let result = await Package.updateOne(
        {
            _id: id
        },
        updateData
    );
    
    if (result.modifiedCount === 0) {
        return res.status(400).json({
            status: "ID not found or no changes were made"
        })
    }
    
    increaseOperation("update");
    return res.status(200).json({
        status: "Package updated successfully"
    })
    
}
router.put("/update", updatePackage);



module.exports = router;