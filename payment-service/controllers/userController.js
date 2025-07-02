import crypto from 'crypto'
import handleAsyncError from "../middleware/handleAsyncError.js"
import { producer } from '../config/kafka.js';
import bcrypt from "bcryptjs";
import validator from 'validator';
import HandleError from '../utils/handleError.js';
import { sendToken } from "../utils/jwtToken.js";
import { Kafka } from "kafkajs";
import generateResetToken from '../utils/resetToken.js';
import { 
    insertNewUser, 
    createTable, 
    getUsers,
    getSingleUser,
    updateUserNameAndPassword,
    updateUserName,
    updateUserPassword,
    updateResetToken,
    checkTokenExpireAndExist
} from "../models/userModel.js"; 
import { log } from 'console';

// createTable()
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
});

export const register =  handleAsyncError(async (req, res, next) => {
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
}) ;


export const users = handleAsyncError(async (req, res, next) => {
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
});

export const login = handleAsyncError(async (req, res, next) => {
    let {email, password} = req.body

    if (!email || !password)
        return next(new HandleError('Both fields are required!', 401))
    
    if (!validator.isEmail(email))
        return next(new HandleError('Invalid Email!', 401))

    const user = await getSingleUser(email)

    if (!user) 
        return next(new HandleError('No record found!', 404))

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
        return next(new HandleError('Wrong email or password!'))
    
    // create session with token
    sendToken(user, 200, res)
});

export const updateUserInfo = handleAsyncError(async (req, res, next) => {
    const { name } = req.body
    const { email } = req.user
    
    if (!name)
        return next(new HandleError('Name cannot be empty!'))
    
    try {        
        const user = await updateUserName(email, name)
        return res.status(200).json({
            succcess: true,
            message: 'Profile updated successfully',
            user
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Failed to update profile"
        })
    }

    // create session with token
});

export const logout = handleAsyncError(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(201).json({
        success: true,
        message: "Successfully logged out"
    })
});

export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { password, newPassword, confirmNewPassword } = req.body
    const { email } = req.user
    
    if (!password || !newPassword || !confirmNewPassword)
        return next(new HandleError('All fields are required'))

    if(newPassword !== confirmNewPassword) 
        return next(new HandleError('New password and confirm password do not match', 202))

    const userinfo = await getSingleUser(email)
    if (!userinfo)
        return next(new HandleError('Internal Issue, retry again later', 500))

    const isMatch = await bcrypt.compare(password, userinfo.password)    
    if (!isMatch)
        return next(new HandleError('Check you passord and try again', 502))

    const hashedPassword  = await bcrypt.hash(newPassword, 16) 
    
    const data = {
        password : hashedPassword
    }
    
    const user = await updateUserPassword(email, data)

    sendToken(user, 200, res)
})

export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body
    if(!email)
        return next(new HandleError('Email is required', 400))
    
    const user = getSingleUser(email)
    if (!user) 
        return next(new HandleError("No record found", 400))

    const { resetToken,resetPasswordToken, resetPasswordExpire} = generateResetToken()
    let resetTokenGenerated;
    let data = {
        resetToken,
        resetPasswordToken,
        resetPasswordExpire
    }

    try {
        resetTokenGenerated = resetToken
        await updateResetToken(email, data)
    } catch (error) {
        return next(new HandleError("Could not save reset token, please try again later", 500))    
    }

    const resetPasswordURL = `${req.protocol}://${req.get('host')}/reset/${resetTokenGenerated}`;
    // connect to kafka to send email

    const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will expire in 3 minutes.
                    \n\n If you didtn't request a password reset, please ignore this message.`;

    try {
        res.status(200).json({
            success: true,
            resetPasswordURL,
            message: `Email is sent to ${user.email} successfully`
        })
    } catch (error) {
        let data = {
            resetToken: undefined,
            resetPasswordToken : undefined,
            resetPasswordExpire :undefined
        }

        await updateResetToken(email, data)
        return next(new HandleError("Email could not be sent, please try again later", 500))
    }
})

export const resetPassword = handleAsyncError( async (req, res, next) => {
    const hashedId = crypto.createHash("sha256").update(req.params.id).digest('hex')
    
    let data = {
        resetPasswordToken: hashedId,
    }

    const user = await checkTokenExpireAndExist(data)    

    if (!user || user.resetPasswordExpire < Date.now()) {
        return next(new HandleError("Reset password token is invalid or has been expired", 404))
    }
    
    const {password, confirmPassword} = req.body
    if(!password || !confirmPassword)
        return next(new HandleError("Both fields are required", 404))

    if(password !== confirmPassword)
        return next(new HandleError("Password doesn't match", 404))

    const hashedPassword = await bcrypt.hash(password, 16)
    
    data = {
        password: hashedPassword
    }
    await updateUserPassword(user.email, data)

    data = {
        resetToken: undefined,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined
    }

    await updateResetToken(user.email, data)

    // connect kafka
    return res.status(200).json({
        succcess: true,
        message: 'Password reset successfully'
    })
})
