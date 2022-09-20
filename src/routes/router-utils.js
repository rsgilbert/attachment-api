import {validationResult} from "express-validator"
import http from '@passioncloud/http'


export function expressValidatorHandler(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0]
        console.log(firstError)
        const msg = `Validation Error: ${firstError.param} -> ${firstError.msg}`
        return res.status(http.statusCodes.BAD_REQUEST).json({error: msg});
    }
    next();
}



export const logErrorHandler = (err, req, res, next) => {
    console.error(err.stack)
    next(err);
}

export const handleError = (err, req, res, next) => {
    res.statusCode = http.statusCodes.INTERNAL_SERVER_ERROR
    res.json({ error: err.message });
}

