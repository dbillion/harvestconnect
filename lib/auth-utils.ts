export const getGoogleAuthUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback/google`,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const getGithubAuthUrl = () => {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback/github`,
    scope: "user:email",
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};
