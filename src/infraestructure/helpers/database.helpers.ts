import { USER_VALIDATION_FAILED } from '../constants';

export const invalidDataErrorCatch = error => {
  if (error?._message === USER_VALIDATION_FAILED) {
    const [path]: string[] = Object.keys(error?.errors);
    const kind: string = error?.errors?.[path]?.kind;

    const message: string = error?.message;
    const errorMessage: string = error?._message;

    return { isInvalid: true, path, errorMessage, message, kind };
  }

  return { isInvalid: false };
};
