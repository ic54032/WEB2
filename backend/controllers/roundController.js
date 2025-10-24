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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoundData = exports.addRestultsToRound = exports.closeRound = exports.createRound = exports.getRounds = void 0;
const roundService_1 = require("../services/roundService");
const getRounds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rounds = yield (0, roundService_1.getAllRoundsFromDb)();
    res.status(200).json(rounds);
});
exports.getRounds = getRounds;
const createRound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newRound = yield (0, roundService_1.createNewRoundInDB)();
    res.status(201).json(newRound);
});
exports.createRound = createRound;
const closeRound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const closedRound = yield (0, roundService_1.deactivateRoundInDb)();
    var message = 'No active round to close';
    if (closedRound != null) {
        message = 'Round ' + closedRound.id + ' closed';
    }
    res.status(200).json({ message: message });
});
exports.closeRound = closeRound;
const addRestultsToRound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roundId, resultData } = req.body;
    (0, roundService_1.addResultToRoundInDb)(roundId, resultData);
    res.status(200).json({ message: 'Results added to round ' + roundId + ', ' + resultData });
});
exports.addRestultsToRound = addRestultsToRound;
const getRoundData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, roundService_1.getRoundDataFromDb)().then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({ message: 'Error retrieving round data', error });
    });
});
exports.getRoundData = getRoundData;
