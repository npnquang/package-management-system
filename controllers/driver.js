const express = require("express"); // express app
const Driver = require("../models/driver"); // Driver class
const Package = require("../models/package");
const { default: mongoose } = require("mongoose");
const { connectDB, generateRandomString } = require("../utils/utils");
const { increaseOperation } = require("./crud_operations");

connectDB();

let router = express.Router();
router.use(express.static("node_modules/bootstrap/dist/css"));

router.use(express.urlencoded({extended: true}));
router.use(express.json());


/**
 * This function renders the list drivers view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function renderDrivers(req, res) {
    let drivers = await Driver.find({}).populate("assigned_packages").exec();
    increaseOperation("read");
    res.render("driver_view/list", {data: drivers});
}
router.get("/list", renderDrivers);


/**
 * This function renders the form to add a driver
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
function renderAddDriverForm(req, res) {
    res.render("driver_view/add");
}
router.get("/add", renderAddDriverForm);


/**
 * This function handle the POST request submitted to add a driver to the database
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function addNewDriver(req, res) {
    let newDriver = new Driver({
        _id: new mongoose.Types.ObjectId(),
        driverId: "D" + parseInt(Math.random() * 100) + "-32-" + generateRandomString("letters", 3),
        name: req.body.name,
        department: req.body.department,
        licence: req.body.licence,
        isActive: req.body.isActive ? true : false
    });
    try {
        await newDriver.save();
        increaseOperation("create")
        return res.redirect("/32963742/James/driver/list");
    } catch (err) {
        let messages = [];
        for (let field in err.errors) {
            messages.push(err.errors[field].message);
        }
        return res.render("common/invalid", {errors: messages});
    }
    
}
router.post("/add-driver", addNewDriver);


/**
 * This function renders the form to delete a driver by ID
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
function renderDeleteDriverForm(req, res) {
    res.render("driver_view/delete");
}
router.get("/delete", renderDeleteDriverForm);


/**
 * This function handles the DELETE request submitted by the button from the list drivers view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function deleteDriverButton(req, res) {
    let id = req.query.id;
    id = new mongoose.Types.ObjectId(id.trimEnd());

    let packages = await Driver.findOne(
        {
            _id: id
        }
    ).select("assigned_packages").populate("assigned_packages").exec();
    packages = packages["assigned_packages"];

    packages.map(
        async (item) => {
            await Package.deleteOne({
                _id: item._id
            })
            increaseOperation("delete");
        }
    );

    await Driver.deleteOne({
        _id: id
    });
    increaseOperation("delete");

    res.status(200);
}
router.delete("/delete-button", deleteDriverButton);


/**
 * This function handles the DELETE request submitted by the form 
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function deleteDriverForm(req, res) {
    let id = req.query.id;
    id = id.trimEnd();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render("common/invalid", {errors: ["Invalid Driver ID"]});
    }
    
    id = new mongoose.Types.ObjectId(id);
    let packages = await Driver.findOne(
        {
            _id: id
        }
    ).select("assigned_packages").populate("assigned_packages").exec();

    if (!packages) {
        return res.render("common/invalid", {errors: ["ID not found"]});
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
    })

    if (result.deletedCount == 1) {
        increaseOperation("delete");
        return res.redirect("/32963742/James/driver/list");
    } else {
        return res.render("common/invalid", {errors: ["Driver ID does not exist"]});
    }
}
router.get("/delete-form", deleteDriverForm);


/**
 * This function renders the filter by department view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function filterDriver(req, res) {
    increaseOperation("read");
    let drivers = await Driver.find({});
    res.render("driver_view/department", {data: drivers});
}
router.get("/department", filterDriver);

module.exports = router;