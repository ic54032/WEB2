"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roundController_1 = require("../controllers/roundController");
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const router = express_1.default.Router();
const checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
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
router.get('/rounds', roundController_1.getRounds);
router.post('/new-round', checkJwt, (req, res) => {
    currentRoundActive = true;
    (0, roundController_1.createRound)(req, res);
});
router.post('/close', checkJwt, (req, res) => {
    currentRoundActive = false;
    (0, roundController_1.closeRound)(req, res);
});
router.post('/store-results', checkJwt, (req, res) => {
    (0, roundController_1.addRestultsToRound)(req, res);
});
router.get('/currentRoundData', (req, res) => {
    (0, roundController_1.getRoundData)(req, res);
});
exports.default = router;
