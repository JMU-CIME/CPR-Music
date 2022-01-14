import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const config = {
  django: {
    url: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth-token/`,
    user: "username",
    pw: "password",
  },
  rails: {
    url: "https://teleband.cs.jmu.edu/login",
    user: "email",
    pw: "password",
  },
};

// const backend = 'rails'
const backend = "django";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "michael@tele.band",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize({ csrfToken, username, password }, req) {
        console.log(
          "called credentialsprovider.authorize!",
          username,
          password,
          req
        );
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        console.log("url to fetch credentials:");
        console.log(config[backend].url);
        const res = await fetch(config[backend].url, {
          method: "POST",
          body: JSON.stringify({
            [config[backend].user]: username,
            [config[backend].pw]: password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const userToken = await res.json();
        console.log("\n\n\n\nuserToken from server");
        console.log(userToken);
        // If no error and we have user data, return it
        if (res.ok && !userToken.error) {
          return {
            username: username,
            djangoToken: userToken.token,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.SECRET,
  session: {
    jwt: true,
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/auth/signin", // Displays signin buttons
    signOut: "/auth/signout", // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "===========================\n",
        "signin callback",
        user,
        account,
        profile,
        email,
        credentials
      );
      return user !== null;
    },
    async redirect({ url, baseUrl }) {
      console.log(
        "===========================\n",
        "called callbacks.redirect",
        url,
        baseUrl
      );

      if (url.startsWith(baseUrl)) return url;
      // Allows relative callback URLs
      else if (url.startsWith("/")) {
        console.log("relative");
        const absUrl = new URL(url, baseUrl).toString();
        return absUrl;
      }
      // maybe this was blocking me from reaching auth??
      return url;
    },
    async session({ session, token, user }) {
      console.log(
        "===========================\n",
        "called callbacks.session",
        session,
        token,
        user
      );
      return { ...session, djangoToken: token.djangoToken };
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log(
        "===========================\n",
        "called callbacks.jwt",
        token,
        user,
        account,
        profile,
        isNewUser
      );
      if (user) {
        token.name = user.username;
        token.djangoToken = user.djangoToken;
      }
      return token;
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: {
    colorScheme: "light",
  },

  // Enable debug messages in the console if you are having problems
  debug: true,
});
