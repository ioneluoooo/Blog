import jwt from "jsonwebtoken";
import { secret } from "../secretKey.js";

export default (req, res, next) => {

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    // Just in INSOMNIA the word Bearer is sent by default, so we are replacing it

    if (token) {
        try {
            const decoded = jwt.verify(token, secret);

            req.userId = decoded._id;
            next();
            // 'next' allows us to pass further down our code 
        } catch (error) {
            return res.status(403).json({
                message: 'Net dostupa zaipal'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Net dostupa zaibal'
        })
    }
}