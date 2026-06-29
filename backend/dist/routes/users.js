"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                winRate: true,
                gamesPlayed: true,
                createdAt: true,
            }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Fetch match history
        const matchHistory = await db_1.prisma.match.findMany({
            where: {
                OR: [
                    { player1Id: userId },
                    { player2Id: userId }
                ]
            },
            include: {
                player1: { select: { id: true, username: true } },
                player2: { select: { id: true, username: true } },
                winner: { select: { id: true, username: true } }
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 20
        });
        res.json({
            user,
            matchHistory
        });
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
