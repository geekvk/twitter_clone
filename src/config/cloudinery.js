import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js"

cloudinary.config({
    cloud_name : ENV.CLOUDINERY_CLOUD_NAME,
    api_key : ENV.CLOUDINERY_API_KEY,
    api_secret : ENV.CLOUDINERY_API_SECRET
});

export default cloudinary;