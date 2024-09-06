const express = require("express");
const main_router = require("./controllers/main");
const rest_router = require("./controllers/rest_main");
const auth_router = require("./controllers/auth");
const path = require("path");
const Driver = require("./models/driver");
const Package = require("./models/package");
const { default:mongoose } = require("mongoose");
const { connectDB } = require("./utils/utils");

connectDB();

let app = express();
app.set('port', 8080);
app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("images"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.use("/32963742/James/api", rest_router);
app.use("/32963742/James", auth_router);
app.use("/32963742/James", main_router);

/**
* This function renders the homepage of the app
* 
* @param {Express.Request} req 
* @param {Express.Response} res 
*/
async function renderIndex(req, res) {
    let driverNum = await Driver.countDocuments();
    let packageNum = await Package.countDocuments();
    res.render("common/index.html", {driverNum, packageNum});
}
app.get("/", renderIndex);


/**
 * This function redirects any invalid route to the 404 view
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
function redirect404(req, res) {
    res.redirect("/32963742/James/error");
}
app.get("*", redirect404);

// listen to port
app.listen(app.get('port'), () => {
    console.log("Listening to port 8080 at http://localhost:8080");
})