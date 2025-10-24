import { Router } from 'express';
const { auth, requiresAuth} = require('express-openid-connect'); 
import { RequestContext } from 'express-openid-connect';
import * as dotenv from 'dotenv';

dotenv.config();
const router = Router();

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

export default router;