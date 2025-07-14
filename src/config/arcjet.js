import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js"

// initialize archjet with security rules
export const aj = arcjet({
    key : ENV.ARCJET_KEY,
    characteristics : ["ip.src"],
    rules : [
        shield({ mode : "LIVE"}),
        //bot detection
        detectBot({
            mode : "LIVE",
            allow : [
                "CATEGORY:SEARCH_ENGINE",

            ],
        }),
        //rate limiting with token bucket algorithm
        tokenBucket({
            mode : "LIVE",
            refillRate : 10, // token added per interval
            interval : 10, // interval in seconds
            capacity : 15,// max token in bucket

        })
    ]
})