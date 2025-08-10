import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module "express" {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}