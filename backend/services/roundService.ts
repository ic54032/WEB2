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
    const result = await pool.query('UPDATE rounds SET is_active = FALSE, closed_at = NOW() WHERE is_active = TRUE RETURNING *');
    return result.rows[0];
};

export const addResultToRoundInDb = async (resultData: any) => {
    console.log('Adding result to round:', resultData);
    const result = await pool.query('UPDATE rounds SET drawn_numbers = $1, draw_date = NOW() WHERE is_active = false AND drawn_numbers IS NULL RETURNING *', [resultData]);
    return result.rows[0];
};

export const getActiveRoundFromDB = async () => {
    const result = await pool.query('SELECT * FROM rounds WHERE is_active = TRUE');
    return result.rows;
}

export const getRoundDataFromDb = async (): Promise<{
id: number | null;
is_active: boolean | null;
drawn_numbers: any[];
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
};