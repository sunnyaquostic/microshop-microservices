import crypto from 'crypto'
import handleAsyncError from "../middleware/handleAsyncError.js"
import { producer } from '../config/kafka.js';
import bcrypt from "bcryptjs";
import validator from 'validator';
import HandleError from '../utils/handleError.js';
import { sendToken } from "../utils/jwtToken.js";
import { Kafka } from "kafkajs";
import { 
    insertNewUser, 
    createTable, 
    getUsers, 
    updateUser,
    getSingleUser
} from "../models/userModel.js"; 

export const createOrder = handleAsyncError( async (req, res, next) => {

    const {cart, email, username, userId} = req.body

    //payment : todo
    console.log('api endpoint hit!');
    try {  
        //kafka
        await producer.send({
            topic: "payment-successful",
            messages: [{value: JSON.stringify({ userId, cart })}]
        })
        
        return res.status(200).json({
            message:'payment succeful!',
            info: req.body
        })
    } catch (error) {
        console.error("Failed to send Kafka message:", error);
        return res.status(500).json({ message: "Kafka send error", error: error.message });
    }
})

export const register =  handleAsyncError(async (req, res) => {
    let {name, email, password, confirmPassword} = req.body

    if(!name || !email || !password || !confirmPassword)
        return res.status(204).json({message: 'All fields are required!'})

    if (password !== confirmPassword)
        return res.status(200).json({message: 'Passwords do not match!'})

    const hashedPassword = await bcrypt.hash(password, 16)

    const newUser = {
        name, 
        email,
        password:  hashedPassword
    }

    try {
        const user = await insertNewUser(newUser);
            try {  
                //kafka
                await producer.send({
                    topic: "registration-successful",
                    messages: [{value: JSON.stringify({ user })}]
                })

            } catch (error) {
                console.error("Failed to send Kafka message:", error);
                return res.status(500).json({ message: "Kafka send error", error: error.message });
            }
        return res.status(201).json({
            message: 'User created successfully',
            data: {
                name: newUser.name,
                email: newUser.email
            }, 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
}) 


export const users = handleAsyncError(async (req, res) => {
    const users = await getUsers();
    if (!users) 
        return res.status(200).json({
            success: true,
            message: 'No user found',
            data: {}
        })

    return res.status(200).json({
        success: true,
        users
    })
})

export const login = handleAsyncError(async (req, res, next) => {
    let {email, password} = req.body

    if (!email || !password)
        return next(new HandleError('Both fields are required!', 401))
    
    if (!validator.isEmail(email))
        return next(new HandleError('Invalid Email!', 401))

    const user = await getSingleUser(email)

    if (!user) 
        return next(new HandleError('No record found!', 404))

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) 
        return next(new HandleError('Wrong email or password!'))

    // create session with token
    sendToken(user, 200, res)
})
