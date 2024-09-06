const express = require("express");
const { auth, db } = require("../utils/utils");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { collection, addDoc, getDocs, query, where } = require("firebase/firestore");


router = express.Router();
router.use(express.static("node_modules/bootstrap/dist/css"));

router.use(express.urlencoded({extended: true}));
router.use(express.json());

function renderLoginForm(req, res) {
    res.render("common/login");
}
router.get("/login", renderLoginForm);


async function login(req, res) {
    
}
router.post("/login", renderLoginForm)


function renderRegister(req, res) {
    res.render("common/register");
}
router.get("/register", renderRegister);


async function register(req, res) {
    let { username, password, passwordCheck } = req.body;
    const userCollection = collection(db, "user");
    const q = query(userCollection, where("operation", "==", username));
    let result = await getDocs(q);

    if (!result.empty) {
        return res.render("common/invalid", {errors: ["Username already exists"]});
    }

    if (!password === passwordCheck) {
        return res.render("common/invalid", {errors: "Passwords does not match"});
    }

    let email = username + "@fit2095pdma.com";
    
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            await addDoc(userCollection, {
                username,
                password: userCredential.user.reloadUserInfo.passwordHash
            });
            return res.redirect("/");
        })
        .catch((e) => {
            let errorMessage;

            switch (e.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This username is already in use. Please try another email.";
                    break;
                case "auth/weak-password":
                    errorMessage = "The password is too weak. Please provide a stronger password.";
                    break;
                default:
                    errorMessage = "An unexpected error occurred. Please try again.";
                    break;
            }

            return res.render("common/invalid", {errors: [errorMessage]});
        });

}
router.post("/register", register)

module.exports = router;