import { Request, Response } from 'express';
import { getAllRoundsFromDb, createNewRoundInDB, deactivateRoundInDb, addResultToRoundInDb, getRoundDataFromDb, getActiveRoundFromDB } from '../services/roundService';

export const getRounds = async (req: Request, res: Response) => {
    const rounds = await getAllRoundsFromDb();
    res.status(200).json(rounds);
};

export const createRound = async (req: Request, res: Response) => {
    const existingActiveRounds = await getActiveRoundFromDB();
    if (existingActiveRounds.length > 0) {
        return res.status(204).send();
    }
    const newRound = await createNewRoundInDB();
    res.status(201).json(newRound);
}

export const closeRound = async (req: Request, res: Response) => {
    const closedRound = await deactivateRoundInDb();
    if(!closedRound || closedRound.length === 0){
        res.status(204).send();
    } else {
        res.status(200).json({ message: 'Round ' + closedRound.id + ' closed' });
    }
};

export const addRestultsToRound = async (req: Request, res: Response) => {
    const { resultData }  = req.body;
    const writtenRows = addResultToRoundInDb(resultData);
    if (!writtenRows) {
        return res.status(400).json({ message: 'No active round found to add results' });
    }
    res.status(204).send();
};

export const getRoundData = async (req: Request, res: Response) => {
    getRoundDataFromDb().then((data) => {
        res.status(200).json(data);
    }).catch((error) => {
        res.status(400).json({ message: 'Error retrieving round data', error });
    });
};
