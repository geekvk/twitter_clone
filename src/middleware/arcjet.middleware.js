import { aj } from "../config/arcjet.js"

// Arcjet middleware for rate limiting bot protection and security
export const archjetMiddleware = async(req, res, next) => {
    try{
        const decision = await aj.protect(req, {
            requested : 1 // each request consumes 1 token
        });
        if(decision.isDenied){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({
                    error : "Too many requests",
                    message : "Rate limit exeeded. Please try again later"
                })
            }else if(decision.reason.isBot()){
                return res.status(403).json({
                    error : "bot access denied",
                    message : "automated requests not allowed"
                })
            }else{
                return res.status(403).json({
                    error : "Forbidden",
                    message : "Access denied by security policy"
                })
            }
        }
        //check for spoofed bot
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            return res.status(403).json({
                    error : "spoofed bot access denied",
                    message : "malicious bot activly detected"
                })

        }
        next()
    }catch(error){
        console.error("Arcjet middleware error:", error);
        next();
    }
}