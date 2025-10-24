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
const express_1 = __importDefault(require("express"));
const ticketController_1 = require("../controllers/ticketController");
const router = express_1.default.Router();
router.post('/createTicket', ticketController_1.createTicket);
router.get('/tickets/:userId', ticketController_1.getUserTicketsForCurrentRound);
router.get('/ticket/:ticketId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Rendering ticket details for ticketId:', req.params.ticketId);
    const data = yield (0, ticketController_1.showTicketDetails)(req.params.ticketId);
    console.log('Data to render:', data);
    res.render('ticket', { data });
    return;
}));
exports.default = router;
