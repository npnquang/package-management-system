const express = require("express"); // express app
const rest_driver_router = require("./rest_driver");
const rest_package_router = require("./rest_package");

let router = express.Router(); // main router
router.use(express.static("node_modules/bootstrap/dist/css"));


// connect REST driver router
router.use("/v1/driver", rest_driver_router);
router.use("/v1/package", rest_package_router);

router.get("/", function (req, res) {
    res.json({
        status: "hello"
    });
})

function redirect404Rest (req, res) {
    res.status(404);
    res.json({
        status: "Bad request" 
    })
}
router.get("*", redirect404Rest)

module.exports = router;
