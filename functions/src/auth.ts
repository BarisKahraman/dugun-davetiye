import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp();
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export type AdminUser = {
  email: string;
  uid: string;
};

function allowedAdmins(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(authorizationHeader: string | undefined): Promise<AdminUser> {
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : undefined;

  if (!token) {
    throw new HttpError(401, "Yönetim için giriş gerekli.");
  }

  const decoded = await getAuth().verifyIdToken(token);
  const email = decoded.email?.toLowerCase();
  const admins = allowedAdmins();

  if (!email || !admins.includes(email)) {
    throw new HttpError(403, "Bu hesap yönetim için yetkili değil.");
  }

  return {
    email,
    uid: decoded.uid
  };
}
