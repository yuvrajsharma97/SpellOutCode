const Express = require("express");
const { sendEmailToAuthor } = require("../controllers/contactController");
const router = Express.Router();


router.post("/contactProjectAuthor/:projectId", sendEmailToAuthor);