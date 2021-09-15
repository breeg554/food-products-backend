declare namespace Express {
  interface Request {
    user: {
      _id: string;
      role: string;
      email: string;
      isAnonymous: boolean;
      userPreference: {
        diet: {
          notLike: string[];
        };
        categories: {
          notLike: string[];
        };
      };
    };
  }
}
