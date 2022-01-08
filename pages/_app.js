import { Provider } from "react-redux";
import { useStore } from "../store";
import { SessionProvider } from "next-auth/react";
import "../styles/global.css";
// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps: {session, ...pageProps} }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}
