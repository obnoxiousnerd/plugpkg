enum ERRMSG {
  CLIENT_OFFLINE = 'You are probably offline! Come back after the internet is up.',
}
export const provideErrMessage = (err: unknown): string => {
  if (err instanceof Error) {
    if (err.name === 'auth/network-request-failed') {
      return ERRMSG.CLIENT_OFFLINE;
    }
    if (err.name === 'FirebaseError') {
      return 'An error occured while talking to the backend.';
    }
    if (
      err.message ===
      `A network error (such as timeout, interrupted connection or unreachable host) has occurred.`
    )
      return ERRMSG.CLIENT_OFFLINE;
    return err.message;
  } else if (typeof err === 'string') return err;
};
