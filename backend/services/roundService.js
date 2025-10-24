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
exports.getRoundDataFromDb = exports.getActiveRoundFromDB = exports.addResultToRoundInDb = exports.deactivateRoundInDb = exports.createNewRoundInDB = exports.getAllRoundsFromDb = void 0;
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
const deactivateRoundInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('UPDATE rounds SET is_active = FALSE, closed_at = NOW() WHERE is_active = TRUE RETURNING *');
    return result.rows[0];
});
exports.deactivateRoundInDb = deactivateRoundInDb;
const addResultToRoundInDb = (resultData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Adding result to round:', resultData);
    const result = yield database_1.default.query('UPDATE rounds SET drawn_numbers = $1, draw_date = NOW() WHERE is_active = TRUE AND drawn_numbers IS NULL RETURNING *', [resultData]);
    return result.rows[0];
});
exports.addResultToRoundInDb = addResultToRoundInDb;
const getActiveRoundFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM rounds WHERE is_active = TRUE');
    return result.rows;
});
exports.getActiveRoundFromDB = getActiveRoundFromDB;
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
        return { id: null, is_active: null, drawn_numbers: [] };
    }
    const row = result.rows[0];
    const id = row.id;
    const is_active = row.is_active === true;
    const drawn_numbers = row.drawn_numbers;
    return {
        id: id,
        is_active,
        drawn_numbers
    };
});
exports.getRoundDataFromDb = getRoundDataFromDb;
