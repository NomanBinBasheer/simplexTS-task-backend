import express from "express"


const asyncHandler = (asyncHandler: (req: express.Request, res: express.Response, next: express.NextFunction) => Record<string, any>
) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(asyncHandler(req, res, next)).catch((err) => next(err))
    } 
}

export {asyncHandler}