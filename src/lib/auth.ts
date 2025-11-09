import bcrypt from 'bcryptjs';
import { query } from './db';

type Credentials = {
  email: string;
  password: string;
  firstName:string;
  secondName:string;
};

export async function signIn(
  provider: 'credentials',
  credentials: Pick<Credentials, 'email' | 'password'>
) {
  const { email, password } = credentials;

  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]) as Credentials[];

    if (users.length === 0) {
      const error = new Error('Invalid email or password') as Error & {type:string};
      error.type = 'CredentialsSignin';
      throw error;
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password,user.password);
    if (!passwordMatch) {
      const error = new Error('Invalid email or password') as Error & {type:string};
      error.type = 'CredentialsSignin';
      throw error;
    }

    return user; // success: return user object
  } catch (error) {
    throw error;
  }
}


export async function signup(
   provider: 'credentials',
   credentials: Credentials
){
    const { email, password, firstName, secondName } = credentials;
    const saltRounds = 10;  
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    try {
        const users = await query ('select email from users where email=?', [email]) as Credentials[];
        if (users.length > 0) {
            const error = new Error('this email is used before') as Error & {type:string};
            error.type = 'CredentialsSignup';
            throw error;
        }
        const colors = [
        "#4A90E2", // Blue (Primary)
        "#50E3C2", // Mint Green (Cyan/Teal)
        "#F5A623", // Gold/Orange (Warning)
        "#BD10E0", // Vivid Purple
        "#FF69B4", // Hot Pink
        "#7ED321", // Lime Green (Success)
        "#9013FE", // Deep Indigo
        "#4A4A4A"  // Dark Gray (Neutral)
        ];      
        const color = colors[Math.floor(Math.random() * 9)];
        await query('insert into users (email, password, firstName, secondName, color) values (?, ?, ?, ?,?)',[email, hashedPassword, firstName, secondName, color]);
        return credentials;
    
    } catch (error) {
        throw error
    }
}