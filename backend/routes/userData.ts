const { requiresAuth } = require('express-openid-connect');
import { Router } from 'express';
import * as path from 'path';

const router = Router();


router.get('/profile', requiresAuth(), (req, res) => {
    const profilePath = path.join(__dirname, '..', 'public', 'static', 'profile.html');
    res.sendFile(profilePath);
});

router.get('/form', requiresAuth(), (req, res) => {
    const formPath = path.join(__dirname, '..', 'public', 'static', 'form.html');
    res.sendFile(formPath);
});

export default router;