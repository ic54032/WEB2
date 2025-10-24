import express from 'express';
import { getRounds, createRound, closeRound, addRestultsToRound, getRoundData } from '../controllers/roundController';
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const router = express.Router();

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
});

let currentRoundActive = false;

router.get('/rounds', getRounds);

router.post('/new-round', checkJwt, (req, res) => {
    currentRoundActive = true;
    createRound(req,res);
});

router.post('/close', checkJwt, (req, res) => {
    currentRoundActive = false;
    closeRound(req, res);
});

router.post('/store-results', checkJwt, (req, res) => {
    addRestultsToRound(req, res);
});

router.get('/currentRoundData', (req, res) => {
    getRoundData(req, res);
});

export default router;