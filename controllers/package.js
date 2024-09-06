const express = require("express"); // express app
const Package = require("../models/package"); // Package class
const Driver = require("../models/driver"); // drivers database
const { default: mongoose } = require("mongoose");
const { connectDB, generateRandomString } = require("../utils/utils");
const { increaseOperation } = require("./crud_operations");

connectDB();

let router = express.Router(); // package router
router.use(express.static("node_modules/bootstrap/dist/css"));

router.use(express.urlencoded({extended: true}));
router.use(express.json());


/**
 * This function renders the list packages view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function renderPackages(req, res) {
    let packages = await Package.find({});
    increaseOperation("read");
    res.render("package_view/list", {data: packages});
}
router.get("/list", renderPackages);



/**
 * This function renders the form to add drivers
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function renderAddPackageForm(req, res) {
    let drivers = await Driver.find({});
    res.render("package_view/add", {data: drivers});

}
router.get("/add", renderAddPackageForm);

/**
 * This function handles the POST method submitted to the add a package to the database
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function addNewPackage(req, res) {
    let newPackage = new Package({
        _id: new mongoose.Types.ObjectId(),
        packageId: "P" + generateRandomString("letters", 2) + "-JN-" + generateRandomString("numbers", 3),
        title: req.body.title,
        weight: req.body.weight,
        destination: req.body.destination,
        description: req.body.description,
        isAllocated: req.body.isAllocated ? true : false,
        driverId: new mongoose.Types.ObjectId(req.body.driverId)
    });

    try {
        await newPackage.save();
        await Driver.updateOne(
            {
                _id: new mongoose.Types.ObjectId(req.body.driverId),
            },
            {
                $push: {
                    assigned_packages: newPackage._id
                }
            }
        );
        increaseOperation("create");
        return res.redirect("/32963742/James/package/list");
        
    } catch (err) {
        let messages = [];
        for (let field in err.errors) {
            if (field == "weight") {
                messages.push("Package weight must be a positive number");
            } else {
                messages.push(err.errors[field].message);
            }
        }
        return res.render("common/invalid", {errors: messages});
    }

    
}
router.post("/add-package", addNewPackage);

/**
 * This function renders the form to delete a package by ID
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
function renderDeletePackageForm(req, res) {
    res.render("package_view/delete");
}
router.get("/delete", renderDeletePackageForm);

/**
 * This function handles the DELETE request submitted by the button from the list package view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function deletePackageButton(req, res) {
    let id = req.query.id;
    id = id.trimEnd();
    await Package.deleteOne({
        _id: new mongoose.Types.ObjectId(id)
    });
    increaseOperation("delete");
    res.status(200);
}
router.delete("/delete-button", deletePackageButton);

/**
 * This function handles the DELETE request submitted by the button from the delete package view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function deletePackageForm(req, res) {
    let id = req.query.id;
    id = id.trimEnd();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render("common/invalid", {errors: ["Invalid Driver ID"]});
    }
    
    id = new mongoose.Types.ObjectId(id);
    let package = await Package.findOne({
        _id: id
    });

    if (!package) {
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

    let result = await Package.deleteOne({
        _id: id
    })

    increaseOperation("delete");
    return res.redirect("/32963742/James/package/list");
    
}
router.get("/delete-form", deletePackageForm);


module.exports = router;