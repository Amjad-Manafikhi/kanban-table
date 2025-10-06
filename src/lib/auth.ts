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

    try {
        const users = await query ('select email from users where email=?', [email]) as Credentials[];
        if (users.length > 0) {
            const error = new Error('this email is used before') as Error & {type:string};
            error.type = 'CredentialsSignup';
            throw error;
        }
        await query('insert into users (email, password, firstName, secondName) values (?, ?, ?, ?)',[email, password, firstName, secondName]);
        return credentials;
    
    } catch (error) {
        throw error
    }
}