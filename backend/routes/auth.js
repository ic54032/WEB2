"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { auth, requiresAuth } = require('express-openid-connect');
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const router = (0, express_1.Router)();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER
};
// Attach auth middleware to the router
router.use(auth(config));
router.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? res.redirect(`${process.env.BASE_URL}/profile`) : res.redirect(`${process.env.BASE_URL}/profile`));
});
router.post('/callback', (req, res) => {
    console.log('callback called');
    res.redirect(`${process.env.BASE_URL}/profile`);
});
router.get('/user-status', (req, res) => {
    res.json({
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.isAuthenticated() ? req.oidc.user : null
    });
});
exports.default = router;
