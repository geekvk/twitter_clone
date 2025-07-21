export const protectRoute = async(req, res, next) => {
    const { userId } = req.auth() || {};
    if(!userId){
        return res.status(401).json({ message : 'Forbidden'});
    }
    next();
}