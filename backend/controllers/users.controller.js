/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./controllers/users.controller.js
/*-!INFO!-*/

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const transporter = nodemailer.createTransport({
    host: "oki.org.pl",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
    },
});

module.exports = {
    findOne: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const user = await User.findOne({_id: req.params.id});
            if(!user) return next();
            else return res.status(200).send(user);
        }
    },
    findAll: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const users = await User.find(req.filters).sort({createdAt: "desc"});
            if(!users) return next();
            else return res.status(200).send(users);
        }
    },
    create: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            if(req.body.password === req.body.confirmPassword) {
                const {userName, email, firstName, password, birthDate, city, isLogged, roomID, isActive, quizes} = req.body;
                const user = new User({
                    userName, email,
                    firstName, birthDate,
                    city, isLogged,
                    roomID, isActive: false,
                    quizes, isAdmin: false,
                }); await User.register(user, password); await user.save();

                const userID = await User.findOne({email: req.body.email});

                let confirmMsg = '';
                if(req.body.domain === "quiz") confirmMsg = `Link do aktywacji konta: https://quiz.oki.org.pl/confirm/${userID._id}`;
                if(req.body.domain === "task") confirmMsg = `Link do aktywacji konta: https://zadania.oki.org.pl/confirm/${userID._id}`;

                await transporter.sendMail({
                    from: `"oki.org.pl" <noreply@oki.org.pl>`,
                    to: `${req.body.email}, ${req.body.email}`,
                    subject: "Aktywacja konta w serwisie oki.org.pl",
                    text: confirmMsg,
                });
    
                return res.status(201).json({});
            } else return res.status(403).json({});
        }
    },
    update: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const user = await User.findOne({_id: req.params.id});
            if(!user) return next();

            if(user.passwordResetRequest === true && req.body.password && req.body.confirmPassword) {
                if(req.body.password && (req.body.password === req.body.confirmPassword)) {

                    if((new Date().toISOString().substr(0, 10) === user.expiresIn.toISOString().substr(0, 10)) && user.passwordResetRequest) {
                        user.setPassword(req.body.password, () => {user.save();});
                    
                        let r = Math.random().toString(36).substring(2);
                        const salt = bcrypt.genSaltSync(10);
                        const hash = await bcrypt.hash(r, salt).then(hash => hash);

                        user.lastPasswordReset = new Date();
                        user.passwordResetRequest = false;
                        user.unique = hash;
			            user.expiresIn = new Date("1970-01-01");

                        return res.status(200).send(user);
                    } else return res.status(403).json({});
                }
            } else {
                if(req.body.expiresIn) user.expiresIn = req.body.expiresIn;
                if(req.body.userName) user.userName = req.body.userName;
                if(req.body.email) user.email = req.body.email;
                if(req.body.firstName) user.firstName = req.body.firstName;
                if(req.body.birthDate) user.birthDate = req.body.birthDate;
                if(req.body.city) user.city = req.body.city;
                if(req.body.isLogged === true) user.isLogged = true;
                if(req.body.isLogged === false) user.isLogged = false;
                if(req.body.roomID) user.roomID = req.body.roomID;
                if(req.body.isActive) user.isActive = req.body.isActive;
                if(req.body.isActive) user.isActive = req.body.isActive;
                if(req.body.quizes) user.quizes = req.body.quizes;
    
                await user.save();
                return res.status(200).send(user);
            }
        }
    },
    remove: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const user = await User.findOne({_id: req.params.id});
            if(!user) return next();
            else await user.remove();

            return res.status(200).json({});
        }
    },
    check: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const user = await User.findOne({_id: req.user._id});
            if(user.isActive) {
                const token = jwt.sign({id: req.user._id}, process.env.JWT_SECRET, {expiresIn: 1200})
                return res.status(200).send({token, id: req.user._id});
            } else return res.status(403).json({});
        }
    },
    forgot: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const user = await User.findOne({email: req.body.email});
            if(!user) return next();

            let r = Math.random().toString(36).substring(2);
            const salt = bcrypt.genSaltSync(10);
            let hash = await bcrypt.hash(r, salt).then(hash => hash);
		        hash = hash.replace(/[\/&+.?%-]/g, '');

            user.passwordResetRequest = true;
            user.expiresIn = new Date().toISOString().substr(0, 10);
            user.unique = hash;

	        let resetMsg = '';
	        if(req.body.domain === "quiz") resetMsg = `Link do resetowania hasła: https://quiz.oki.org.pl/reset/${user._id}/${hash} \n Jest on ważny do godziny 00:00 danego dnia!`;
	        if(req.body.domain === "task") resetMsg = `Link do resetowania hasła: https://zadania.oki.org.pl/reset/${user._id}/${hash} \n Jest on ważny do godziny 00:00 danego dnia!`;

            await transporter.sendMail({
                from: `"oki.org.pl" <noreply@oki.org.pl>`,
                to: `${req.body.email}, ${req.body.email}`,
                subject: "Resetowanie hasła w serwisie oki.org.pl",
                text: resetMsg,
            }); await user.save();

            return res.status(200).json({});
        }
    }
};
