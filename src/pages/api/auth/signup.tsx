import type { NextApiRequest, NextApiResponse } from 'next';
import { signup } from '@/lib/auth';
import { createSession } from '@/lib/session';

type CustomError = Error & { type?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;

    try {
        const user = await signup('credentials', { email, password, firstName, secondName });

        // Set a session using real user ID
        await createSession(res, user.email);

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
