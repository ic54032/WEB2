"use strict";
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
exports.getTicketById = exports.countUserTicketsForNewestRound = exports.saveTicketToDB = exports.getTicketsFromDB = void 0;
const database_1 = __importDefault(require("../database/database"));
const getTicketsFromDB = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM tickets WHERE id = $1', [user_id]);
    return result.rows;
});
exports.getTicketsFromDB = getTicketsFromDB;
const saveTicketToDB = (ticketData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, round_id, numbers, id_number } = ticketData;
    const result = yield database_1.default.query('INSERT INTO tickets (user_id, numbers, round_id, created_at, id_number) VALUES ($1, $2, $3, NOW(), $4) RETURNING *', [user_id, numbers, round_id, id_number]);
    console.log('Insert result:', result.rows);
    return result.rows[0].id;
});
exports.saveTicketToDB = saveTicketToDB;
const countUserTicketsForNewestRound = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const roundRes = yield database_1.default.query('SELECT id FROM rounds ORDER BY created_at DESC LIMIT 1');
    if (roundRes.rowCount === 0)
        return { roundId: null, count: 0 };
    const roundId = roundRes.rows[0].id;
    const countRes = yield database_1.default.query('SELECT COUNT(*)::int AS count FROM tickets WHERE user_id = $1 AND round_id = $2', [user_id, roundId]);
    return { roundId, count: countRes.rows[0].count };
});
exports.countUserTicketsForNewestRound = countUserTicketsForNewestRound;
const getTicketById = (ticketId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    return result.rows[0];
});
exports.getTicketById = getTicketById;
