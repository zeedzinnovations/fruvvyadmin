import crypto from "crypto";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const ACCESS_TOKEN_EXPIRY = "1d"; 
const REFRESH_TOKEN_EXPIRY_DAYS = 90; 
const JWT_SECRET = process.env.JWT_SECRET || "please-set-a-secret";
const REFRESH_COOKIE_NAME = "refreshToken";


const generateOTP = () => crypto.randomInt(1000, 9999).toString();
const generateRefreshTokenPlain = () => crypto.randomBytes(48).toString("hex");
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const generateAccessToken = (payload) =>
  jwt.sign(
    {
      ...payload,
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
const refreshTokenExpiryDate = () =>
  new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  path: "/",
};


export const sendOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;
    if (!phone_number)
      return res.status(400).json({ message: "Phone number required" });

    // Delete old OTPs
    await pool.query(`DELETE FROM otp_store WHERE phone_number=$1`, [phone_number]);

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await pool.query(
      `INSERT INTO otp_store (phone_number, otp, expires_at, created_at)
       VALUES ($1,$2,$3,NOW())`,
      [phone_number, otp, expires_at]
    );

    res.json({ message: "OTP sent", otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { phone_number, otp } = req.body;
    if (!phone_number || !otp)
      return res.status(400).json({ message: "Phone number & OTP required" });

    const result = await pool.query(
      `SELECT * FROM otp_store
       WHERE phone_number=$1 AND otp=$2 AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone_number, otp]
    );

    if (!result.rows.length)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // Generate tokens
    const accessToken = generateAccessToken({ phone_number });
    const plainRefreshToken = generateRefreshTokenPlain();
    const refreshTokenHash = hashToken(plainRefreshToken);
    const refreshExpiresAt = refreshTokenExpiryDate();

    // Delete old refresh tokens
    await pool.query(`DELETE FROM refresh_tokens WHERE phone_number=$1`, [phone_number]);

    // Insert new refresh token and get its ID
    const insertResult = await pool.query(
      `INSERT INTO refresh_tokens (phone_number, token_hash, expires_at, created_at)
       VALUES ($1,$2,$3,NOW())
       RETURNING id`,
      [phone_number, refreshTokenHash, refreshExpiresAt]
    );

    const refreshTokenId = insertResult.rows[0].id;

    // Set refresh token cookie
    res.cookie(REFRESH_COOKIE_NAME, plainRefreshToken, cookieOptions);

    // Send full response
    res.json({
      id: refreshTokenId,
      phone_number,
      accessToken,
      accessTokenExpiry: ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: refreshExpiresAt,
      refreshTokenHash, 
      message: "OTP verified",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const plainRefreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!plainRefreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const providedHash = hashToken(plainRefreshToken);

    const result = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token_hash=$1 LIMIT 1`,
      [providedHash]
    );

    if (!result.rows.length)
      return res.status(401).json({ message: "Invalid refresh token" });

    const tokenData = result.rows[0];

    // Check expiration
    if (new Date() > tokenData.expires_at) {
      await pool.query(`DELETE FROM refresh_tokens WHERE id=$1`, [tokenData.id]);
      res.clearCookie(REFRESH_COOKIE_NAME);
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // Generate new refresh token
    const newPlainRefresh = generateRefreshTokenPlain();
    const newRefreshHash = hashToken(newPlainRefresh);
    const newRefreshExpiry = refreshTokenExpiryDate();

    await pool.query(`DELETE FROM refresh_tokens WHERE id=$1`, [tokenData.id]);
    await pool.query(
      `INSERT INTO refresh_tokens (phone_number, token_hash, expires_at, created_at)
       VALUES ($1,$2,$3,NOW())`,
      [tokenData.phone_number, newRefreshHash, newRefreshExpiry]
    );

    res.cookie(REFRESH_COOKIE_NAME, newPlainRefresh, cookieOptions);

    const newAccessToken = generateAccessToken({ phone_number: tokenData.phone_number });

    res.json({ accessToken: newAccessToken, expiresIn: ACCESS_TOKEN_EXPIRY });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Refresh token failed" });
  }
};

export const getOtpList = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM otp_store ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch OTP list" });
  }
};

export const getAllRefreshTokens = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM refresh_tokens ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch refresh tokens" });
  }
};
