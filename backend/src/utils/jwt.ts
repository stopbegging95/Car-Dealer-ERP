import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { config } from "../config/env.js";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  department?: string;
  branch?: string;
  name?: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

export const sendTokenCookie = (res: Response, token: string, refreshToken?: string): void => {
  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: (config.nodeEnv === "production" ? "none" : "lax") as "none" | "lax",
  };

  res.cookie("token", token, cookieOptions);
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
};
