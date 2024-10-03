const bcrypt = require("bcrypt");
const  User = require("../models/User");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup route handler
exports.signup = async (req, res) => {
    try {
        // Get data
        const { FirstName, LastName, PhoneNumber, Email, Password, Gender, accountType} = req.body;
    
        const {Branch, YearOfJoining, CurrentYear }=req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ Email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        // Secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(Password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing password',
            });
        }

        // Create entry for User
        const user = await User.create({
            FirstName, LastName, Email, Password: hashedPassword, accountType,PhoneNumber,Gender
        });

        // Create corresponding entry in Student or Instructor based on accountType
        if (accountType === "Student") {
            if (!Branch || !YearOfJoining) {
                // Rollback user creation and return error
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({
                    success: false,
                    message: 'Mandatory fields for Student are missing',
                });
            }
            await Student.create({ UserID: user._id, Branch, YearOfJoining, CurrentYear });
        } else if (accountType === "Instructor") {
            const { Department , Key } = req.body;
            console.log(req.body);
            if ((!Department && !Key) || (Key!=process.env.KeyInstruct) ) {
                // Rollback user creation and return error
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({
                    success: false,
                    message: 'Mandatory fields for Instructor are missing',
                });
            }
            await Instructor.create({ UserID: user._id, Department });
        }
        return res.status(200).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again later',
        });
    }
};

// Login route handler
exports.login = async (req, res) => {
    try {
        // Data fetch
        const { Email, Password } = req.body;

        // Validation on email and password
        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all the details carefully',
            });
        }

        // Check for a registered user
        const user = await User.findOne({ Email });
        
        // If not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered',
            });
        }

        const payload = {
            email: user.Email,
            id: user._id,
            accountType: user.accountType,
        };

        // Verify password & generate a JWT token
        if (await bcrypt.compare(Password, user.Password)) {
            // Password match
            const token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                });

            user.Password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User logged in successfully',
            });
        } else {
            // Password does not match
            return res.status(403).json({
                success: false,
                message: "Password incorrect",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure',
        });

    }
};
