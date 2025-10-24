import { Request, Response } from 'express';
import { getTicketsFromDB, saveTicketToDB, countUserTicketsForNewestRound, getTicketById } from '../services/ticketService';
import QRCode from 'qrcode';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import pool from '../database/database';

dotenv.config();

export const createTicket = async (req: Request, res: Response) => {
    const ticketData = req.body;
    const uuid = await saveTicketToDB(ticketData);

    const qrUrl = `${process.env.BASE_URL}?uuid=${uuid}`;
    const qrImageBuffer = await QRCode.toBuffer(qrUrl);

    res.setHeader('Content-Type', 'image/png');
    res.send(qrImageBuffer);
};

export const getUserTicketsForCurrentRound = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const rounAndCount = await countUserTicketsForNewestRound(userId);
        res.json(rounAndCount);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving count', error });
    }
};

export const showTicketDetails = async (ticketId: string) => {
    try {
         const ticket = await getTicketById(ticketId);
         if (!ticket) {
                return { status: 404, json: { message: 'Ticket not found' } };
         }
         const round = await pool.query('SELECT * FROM rounds WHERE id = $1', [ticket.round_id]);
         if (round.rowCount === 0) {
            return { status: 404, json: { message: 'Round not found for this ticket' } };
        }
         return { ticket, round: round.rows[0] };
    } catch (error) {
         return { status: 500, json: { message: 'Error retrieving ticket', error } };
    }
};

export const getTicket = async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    try {
        const ticket = await getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ticket', error });
    }
};
