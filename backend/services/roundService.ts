import pool from '../database/database';

export const getAllRoundsFromDb = async () => {
    const result = await pool.query('SELECT * FROM rounds');
    return result.rows;
};

export const createNewRoundInDB = async () => {
    const result = await pool.query('INSERT INTO rounds (is_active, created_at) VALUES (TRUE, NOW())')
    return result.rows[0];
};

export const deactivateRoundInDb = async () => {
    const result = await pool.query('UPDATE rounds SET is_active = FALSE, closed_at = NOW() WHERE is_active = TRUE');
    return result.rows[0];
};

export const addResultToRoundInDb = async (roundId: number, resultData: any) => {
    const result = await pool.query('UPDATE rounds SET drawn_numbers = $2, draw_date = NOW() WHERE id = $1', [roundId, resultData]);
    return result.rows[0];
};

export const getRoundDataFromDb = async (): Promise<{
roundId: number | null;
isActive: boolean | null;
drawnNumbers: any[];
}> => {
    const sql = `
    SELECT r.id,
            r.is_active,
            r.drawn_numbers
    FROM rounds r
    ORDER BY r.created_at DESC
    LIMIT 1
    `;
    const result = await pool.query(sql);
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
};