import type { NextApiRequest, NextApiResponse } from 'next';
import { signup } from '@/lib/auth';
import { createSession } from '@/lib/session';

import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';

type CustomError = Error & { type?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }


    const { email, password, firstName, secondName } = req.body


    if (

        email === undefined ||
        password === undefined ||
        firstName === undefined ||
        secondName === undefined
    ) {
        return res.status(400).json({ message: 'Missing signup values' });
    }

    const uuid = Array(10).fill(null).map(() => uuidv4())

    const date = new Date



    try {
        const user = await signup('credentials', { email, password, firstName, secondName });

        const userId = user.userId
        await query(
            'INSERT INTO tags (tag_id, tag_name, color, user_id, company_id) VALUES (?,?,?,?,?)',
            [uuid[0], 'Personal', '#FF69B4', userId, 21]
        );

        await query(
            'INSERT INTO tags (tag_id, tag_name, color, user_id, company_id) VALUES (?,?,?,?,?)',
            [uuid[1], 'Work', '#BD10E0', userId, 21]
        );

        await query(
            'INSERT INTO tags (tag_id, tag_name, color, user_id, company_id) VALUES (?,?,?,?,?)',
            [uuid[2], 'Learning', '#F5A623', userId, 21]
        );


        await query(
            'INSERT INTO task_types (type_id, type_name, idx, user_id, company_id) VALUES (?,?,?,?,?)',
            [`column-${uuid[3]}`, 'In Queue', 1, userId, 21]
        );

        await query(
            'INSERT INTO task_types (type_id, type_name, idx, user_id, company_id) VALUES (?,?,?,?,?)',
            [`column-${uuid[4]}`, 'In Progress', 2, userId, 21]
        );

        await query(
            'INSERT INTO task_types (type_id, type_name, idx, user_id, company_id) VALUES (?,?,?,?,?)',
            [`column-${uuid[5]}`, 'Done', 3, userId, 21]
        );



        await query(
            'INSERT INTO tasks (task_id, user_id, type_id, title, description, created_at, idx, company_id, tag_id) VALUES (?,?,?,?,?,?,?,?,?)',
            [`task-${uuid[6]}`, userId, `column-${uuid[4]}`, 'Read documentation', 'Read project docs', date, 1, 21, uuid[2]]
        );

        await query(
            'INSERT INTO tasks (task_id, user_id, type_id, title, description, created_at, idx, company_id, tag_id) VALUES (?,?,?,?,?,?,?,?,?)',
            [`task-${uuid[7]}`, userId, `column-${uuid[3]}`, 'Fix bug', 'Fix login bug', date, 1, 21, uuid[1]]
        );

        await query(
            'INSERT INTO tasks (task_id, user_id, type_id, title, description, created_at, idx, company_id, tag_id) VALUES (?,?,?,?,?,?,?,?,?)',
            [`task-${uuid[8]}`, userId, `column-${uuid[5]}`, 'Prepare for meeting', 'Prepare slides', date, 1, 21, uuid[2]]
        );

        await query(
            'INSERT INTO tasks (task_id, user_id, type_id, title, description, created_at, idx, company_id, tag_id) VALUES (?,?,?,?,?,?,?,?,?)',
            [`task-${uuid[9]}`, userId, `column-${uuid[5]}`, 'Buy groceries', 'Milk, eggs, bread', date, 1, 21, uuid[0]]
        );



        // Set a session using real user ID
        console.log("create")
        await createSession(res, user.email);
        console.log("created")

        return res.status(200).json({ success: true });
    } catch (error) {
        const err = error as CustomError;
        if (err?.type === 'CredentialsSignup') {
            return res.status(401).json({ error: 'this email is used before.' });
        }

        console.error(error);
        return res.status(500).json({ error: 'Something went wrong.' });
    }
}
