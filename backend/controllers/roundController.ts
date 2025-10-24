import { Request, Response } from 'express';
import { getAllRoundsFromDb, createNewRoundInDB, deactivateRoundInDb, addResultToRoundInDb, getRoundDataFromDb } from '../services/roundService';

export const getRounds = async (req: Request, res: Response) => {
    const rounds = await getAllRoundsFromDb();
    res.status(200).json(rounds);
};

export const createRound = async (req: Request, res: Response) => {
    const newRound = await createNewRoundInDB();
    res.status(201).json(newRound);
}

export const closeRound = async (req: Request, res: Response) => {
    const closedRound = await deactivateRoundInDb();
    var message='No active round to close';
    if(closedRound != null){
        message='Round ' + closedRound.id + ' closed';
    }
    res.status(200).json({ message: message });
};

export const addRestultsToRound = async (req: Request, res: Response) => {
    const { roundId, resultData } = req.body;
    addResultToRoundInDb(roundId, resultData);
    res.status(200).json({ message: 'Results added to round ' + roundId + ', ' + resultData});
};

export const getRoundData = async (req: Request, res: Response) => {
    getRoundDataFromDb().then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(500).json({ message: 'Error retrieving round data', error });
    });
};
