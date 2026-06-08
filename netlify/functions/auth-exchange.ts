import { Credentials, OAuth2Client } from "google-auth-library";
import { serialize } from "cookie";

export default async (req: Request) => {
  const { code, userProfile } = await req.json();

  const oAuth2Client = new OAuth2Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  });

  let tokens: Credentials;

  try {
    const response = await oAuth2Client.getToken({
      code: code,
      redirect_uri: "postmessage",
    });

    tokens = response.tokens;
  } catch (exception) {
    console.log(exception);
    throw exception;
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  if (tokens.refresh_token) {
    const sessionData = {
      rt: tokens.refresh_token,
      user: userProfile,
    };

    const encodedSession = encodeURIComponent(JSON.stringify(sessionData));

    const tokenCookie = serialize("google_session", encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    headers.append("Set-Cookie", tokenCookie);
  }

  return new Response(
    JSON.stringify({
      accessToken: tokens.access_token,
      userProfile: userProfile,
    }),
    { status: 200, headers },
  );
};
