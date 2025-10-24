import express from 'express';
import { createTicket, getUserTicketsForCurrentRound, showTicketDetails } from '../controllers/ticketController';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

router.post('/createTicket', createTicket);

router.get('/tickets/:userId', getUserTicketsForCurrentRound);

router.get('/ticket/:ticketId', async (req, res)=> {
    console.log('Rendering ticket details for ticketId:', req.params.ticketId);
    const data = await showTicketDetails(req.params.ticketId);
    res.render('ticket', { data });
    return
});
export default router;