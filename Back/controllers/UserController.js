import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import { secret } from '../secretKey.js';

export const register = async (req, res) => {
    try {
        // Hashing the password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt)

        const doc = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hashedpass,
            avatarUrl: req.body.avatarUrl,
        });
        // Creating a document 

        const user = await doc.save();
        // Saving the document

        const token = jwt.sign({
            _id: user._id,
        }, secret,
            {
                expiresIn: '30d' // Valid time
            })

        const { passwordHash, ...userData } = user._doc // Desctructurization

        res.json({
            ...userData,
            // ...user , we'll get all the info about user
            token
        })
        // should be one response everytime

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Cannot auth'
        })
    }
}

export const login = async (req, res) => {
    try {
        // Finding the user
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        // Finding the password
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Login or pass invalid'
            })
        }

        const token = jwt.sign({
            _id: user._id,
        },
            secret,
            {
                expiresIn: '30d' // Valid time
            })

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Cannot login'
        })
    }
}

export const getMe = async (req, res) => {
    //* NOTE: checkAuth is a middleware , the 'next' function allows us to pass through 
    try {
        const user = await User.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: 'User not found '
            })
        }
        
        const { passwordHash, ...userData } = user._doc

        // if user did find out return
        res.json(userData)
        
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Net dostupa uje'
        })
    }
}