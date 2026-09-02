import jwt from 'jsonwebtoken'

const generateToken = (customerID)=>{
    return jwt.sign(
        {customerID},
        process.env.JWT_SECRET,
        {expiresIn:"10d"}
    )
}
export default generateToken