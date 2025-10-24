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
exports.getRoundDataFromDb = exports.addResultToRoundInDb = exports.deactivateRoundInDb = exports.createNewRoundInDB = exports.getAllRoundsFromDb = void 0;
const database_1 = __importDefault(require("../database/database"));
const getAllRoundsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM rounds');
    return result.rows;
});
exports.getAllRoundsFromDb = getAllRoundsFromDb;
const createNewRoundInDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('INSERT INTO rounds (is_active, created_at) VALUES (TRUE, NOW())');
    return result.rows[0];
});
exports.createNewRoundInDB = createNewRoundInDB;
const deactivateRoundInDb = (roundId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('UPDATE rounds SET is_active = FALSE, closed_at = NOW() WHERE id = $1', [roundId]);
    return result.rows[0];
});
exports.deactivateRoundInDb = deactivateRoundInDb;
const addResultToRoundInDb = (roundId, resultData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('UPDATE rounds SET drawn_numbers = $2, draw_date = NOW() WHERE id = $1', [roundId, resultData]);
    return result.rows[0];
});
exports.addResultToRoundInDb = addResultToRoundInDb;
const getRoundDataFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    SELECT r.id,
            r.is_active,
            r.drawn_numbers
    FROM rounds r
    ORDER BY r.created_at DESC
    LIMIT 1
    `;
    const result = yield database_1.default.query(sql);
    console.log('Round data:', result.rows);
    if (result.rowCount === 0) {
        return { roundId: null, isActive: null, drawnNumbers: [] };
    }
    const row = result.rows[0];
    const roundId = row.id;
    const isActive = row.is_active === true;
    const drawnNumbers = row.drawn_numbers;
    return {
        roundId,
        isActive,
        drawnNumbers
    };
});
exports.getRoundDataFromDb = getRoundDataFromDb;
