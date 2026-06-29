"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const existingUser = await db_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (existingUser) {
            res.status(400).json({ error: 'User with this email or username already exists' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!validPassword) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
