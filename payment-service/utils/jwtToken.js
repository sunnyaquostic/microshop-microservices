import jwt from "jsonwebtoken";

const getJWTToken = (sentEmail) => {
    return jwt.sign({email: sentEmail}, process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRES
    })
}

export const sendToken= (user, statusCode, res) => {
    const token = getJWTToken();
    const cookieExp = parseInt(process.env.EXPIRE_COOKIE)
    // options for cookies
    const options = {
        expires: new Date(Date.now() + cookieExp * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        user,
        token
    })
}