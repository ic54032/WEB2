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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicket = exports.showTicketDetails = exports.getUserTicketsForCurrentRound = exports.createTicket = void 0;
const ticketService_1 = require("../services/ticketService");
const qrcode_1 = __importDefault(require("qrcode"));
const dotenv = __importStar(require("dotenv"));
const database_1 = __importDefault(require("../database/database"));
dotenv.config();
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketData = req.body;
    const uuid = yield (0, ticketService_1.saveTicketToDB)(ticketData);
    const qrUrl = `${process.env.BASE_URL}?uuid=${uuid}`;
    const qrImageBuffer = yield qrcode_1.default.toBuffer(qrUrl);
    res.setHeader('Content-Type', 'image/png');
    res.send(qrImageBuffer);
});
exports.createTicket = createTicket;
const getUserTicketsForCurrentRound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const rounAndCount = yield (0, ticketService_1.countUserTicketsForNewestRound)(userId);
        res.json(rounAndCount);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving count', error });
    }
});
exports.getUserTicketsForCurrentRound = getUserTicketsForCurrentRound;
const showTicketDetails = (ticketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield (0, ticketService_1.getTicketById)(ticketId);
        if (!ticket) {
            return { status: 404, json: { message: 'Ticket not found' } };
        }
        const round = yield database_1.default.query('SELECT * FROM rounds WHERE id = $1', [ticket.round_id]);
        if (round.rowCount === 0) {
            return { status: 404, json: { message: 'Round not found for this ticket' } };
        }
        return { ticket, round: round.rows[0] };
    }
    catch (error) {
        return { status: 500, json: { message: 'Error retrieving ticket', error } };
    }
});
exports.showTicketDetails = showTicketDetails;
const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketId = req.params.ticketId;
    try {
        const ticket = yield (0, ticketService_1.getTicketById)(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving ticket', error });
    }
});
exports.getTicket = getTicket;
