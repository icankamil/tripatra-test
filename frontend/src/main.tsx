import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <GoogleOAuthProvider clientId="710571733487-av9tj5gkjjgb1v60bntec6pnebthtub0.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </ApolloProvider>
  </StrictMode>
);
