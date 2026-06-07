import { OAuth2Client } from "google-auth-library";
import { parse } from "cookie";

export default async (req: Request) => {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const rawSession = cookies.google_session;

  if (!rawSession) {
    return new Response(JSON.stringify({ error: "No session found" }), {
      status: 401,
    });
  }

  const sessionData = JSON.parse(decodeURIComponent(rawSession));
  const refreshToken = sessionData.rt;
  const userProfile = sessionData.user;

  const oAuth2Client = new OAuth2Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  });
  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const tokenResponse = await oAuth2Client.getAccessToken();

    return new Response(
      JSON.stringify({
        accessToken: tokenResponse.token,
        user: userProfile,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Token revoked" }), {
      status: 401,
    });
  }
};
