const jwt = require("jsonwebtoken");
// example-controller.js
const User = require("../models/User");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");

// Now you can use User, Student, and Instructor in this file


exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while verifying the token',
            error: error.message,
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !(user.accountType=="Admin"))  {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admins',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        });
    }
};

exports.isStudent = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const student = await Student.findOne({ UserID: req.user.id });
        if (!user || !student) {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for students',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        });
    }
};

exports.isInstructor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const instructor = await Instructor.findOne({ UserID: req.user.id });
        if (!user || !instructor) {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for instructors',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        });
    }
};
