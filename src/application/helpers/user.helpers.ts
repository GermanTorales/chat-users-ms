import * as bcrypt from 'bcrypt';
import { HASH_ROUNDS } from '../constants';

export const encryptPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(HASH_ROUNDS, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (error, hash) => {
        if (error) reject(error);

        return resolve(hash);
      });
    });
  });
};

export const compatePasswords = (currentPassword: string, password: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, currentPassword, function (err, isMatch) {
      if (err) reject(err);

      return resolve(isMatch);
    });
  });
};

//TODO: Considerar ponerlo como una clase injectable
