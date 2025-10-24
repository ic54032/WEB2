import pool from '../database/database';

export const getTicketsFromDB = async (user_id?: string) => {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [user_id]);
    return result.rows;
};

export const saveTicketToDB = async (ticketData: any) => {
    const { user_id, round_id, numbers, id_number  } = ticketData;
    const result = await pool.query('INSERT INTO tickets (user_id, numbers, round_id, created_at, id_number) VALUES ($1, $2, $3, NOW(), $4) RETURNING *', [user_id, numbers, round_id, id_number]);
    console.log('Insert result:', result.rows);
    return result.rows[0].id;
};

export const countUserTicketsForNewestRound = async (user_id: string): Promise<{ roundId: number | null; count: number }> => {
    const roundRes = await pool.query('SELECT id FROM rounds ORDER BY created_at DESC LIMIT 1');
    if (roundRes.rowCount === 0) return { roundId: null, count: 0 };

    const roundId = roundRes.rows[0].id;
    const countRes = await pool.query('SELECT COUNT(*)::int AS count FROM tickets WHERE user_id = $1 AND round_id = $2', [user_id, roundId]);
    return { roundId, count: countRes.rows[0].count };
};

export const getTicketById = async (ticketId: string) => {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    return result.rows[0];
}