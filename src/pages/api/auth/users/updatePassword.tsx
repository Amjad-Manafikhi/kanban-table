import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

type User = {
    password:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {
  if (req.method === 'POST') {



    try {
      const { oldPassword, newPassword, userId} = req.body;
      console.log(userId,"email");
      
      const users =await query(
        'select password from users where user_id = ? ', [userId] 
      ) as User[];
      
      if(users?.length===0){
        const error = new Error('Invalid email or password') as Error & {type:string};
        error.type = 'CredentialsSignin';
        throw error;
      }
      const user = users[0];
      const passwordMatch = await bcrypt.compare(oldPassword,user.password);
      if (!passwordMatch) {
        const error = new Error('Old password is wrong') as Error & {type:string};
        error.type = 'CredentialsSignin';
        throw error;
      }

      const result = await query(
      'UPDATE users SET password = ? WHERE email = ?',
      [newPassword, userId]
      );

      res.status(200).json({
        message: 'user updated successfully',
        result,
      });
    } catch (error: unknown) {
        console.error(`Error updating user:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error updating user`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error updating user`,
            error: 'Unknown error occurred',
          });
        }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
