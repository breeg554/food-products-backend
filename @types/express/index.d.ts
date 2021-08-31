declare namespace Express {
  interface Request {
    user: {
      _id: string;
      role: string;
      email: string;
      isAnonymous: boolean;
    };
  }
}
