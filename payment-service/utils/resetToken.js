import crypto from 'crypto'

const generateResetToken = function () { 
    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    const resetPasswordExpire = Date.now()+ 5*60*1000 //5minutes
    return {
        resetToken,
        resetPasswordToken,
        resetPasswordExpire
    }
}

export default generateResetToken