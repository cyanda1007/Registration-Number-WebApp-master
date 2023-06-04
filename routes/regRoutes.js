'Use strict'
const express = require('express');
const router = express.Router();
const {Pool} = require('pg');

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
	useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql:coder:pg123@localhost:5432/my_registration';

const pool = new Pool({
	connectionString,
	ssl : {
		rejectUnauthorized:false
	}
});

const registrationNumber = require('../registration');
RegistrationNumber = registrationNumber(pool);


router
.get('/', async (req, res) => {
    req.flash("getErrors", RegistrationNumber.getMsg());
    res.render("index", {
        regNo: await RegistrationNumber.storeData(),
        color: RegistrationNumber.addedReg()
    });
});

router
.get("/reg_numbers", async (req, res, next) =>{
    try{
        let getTowns = RegistrationNumber.getTown();
        let appendReg = [];
        let color = RegistrationNumber.addedReg();

        if(getTowns !== ""){
            appendReg = await RegistrationNumber.filter(getTown);
            if(appendReg.length == 0){
                req.flash("appedChild", "No Registration number from this town");
            }
        }else{
            req.flash("getErrors", "Please select town")
        }
        res.render("reg_number", {appendReg, color})

    }catch(error){
        next(error)
    }
})


.get("/bottuns", (req, res)=>{
    RegistrationNumber.clearMsg();
    res.redirect("/")
})

.get("/resetBtn", async (req, res) =>{
    await RegistrationNumber.resetBtn();
    req.flash("appendReg", "succesfully reset!")
    RegistrationNumber.clearMsg();
    res.redirect("/");
})


router
.post("/reg_number", async (req, res, next) => {
    try{
        await RegistrationNumber.setRegisration(req.body.addRegistration);
        res.redirect("/")     
    }catch(error){
        next(error)
    }
});

router
.post("/reg_numbers", (req, res, next) => {
    try{
        RegistrationNumber.allTown(req.body.registrationRadio);
        res.redirect("/reg_numbers");
    }catch(error){
        next(error);
    }
});
module.exports = router;