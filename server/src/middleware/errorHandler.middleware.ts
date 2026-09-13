import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const isProduction = process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    message: isProduction ? "Something went wrong" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};