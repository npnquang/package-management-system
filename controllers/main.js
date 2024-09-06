const express = require("express"); // express app
const driver_router = require("./driver"); // driver router
const package_router = require("./package"); // package router
const { getStats } = require("./crud_operations");

let router = express.Router(); // main router
router.use(express.static("node_modules/bootstrap/dist/css"));


// use driver router for /driver route
router.use("/driver", driver_router);
router.use("/package", package_router);

/**
* This function renders the status page
* 
* @param {Express.Request} req 
* @param {Express.Response} res 
*/
async function renderStatus(req, res) {
    let stats = await getStats();
    res.render("common/stats", {stats});
}
router.get("/stats", renderStatus);


/**
* This function renders the 404 not found view
* 
* @param {Express.Request} req 
* @param {Express.Response} res 
*/
function renderErrorPage(req, res) {
    res.render("common/404");
}
router.get("/error", renderErrorPage);

module.exports = router;
