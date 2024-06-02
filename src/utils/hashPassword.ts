import bcrypt from 'bcryptjs';
import { ApiError } from './ApiError';

const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
}

export default hashPassword;