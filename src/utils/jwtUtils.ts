import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Use a secure secret key in production
const JWT_EXPIRATION = '1h'; // Token expiration time

/**
 * Generates a JWT token for a given user.
 * @param userId - The ID of the user.
 * @returns The JWT token.
 */
export function generateToken(userId: string): string {
    const payload = { userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded token payload if valid, or throws an error if invalid.
 */
export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}
