import React, { useState, useEffect } from 'react';
import { createActor, login_backend } from 'declarations/login_backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [principalText, setPrincipalText] = useState("");


  let actorLoginBackend = login_backend;

  async function login() {
    const authClient = await AuthClient.create();

    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        console.log(identity.getPrincipal().toText());

        const agent = new HttpAgent({ identity });
        actorLoginBackend = createActor(process.env.CANISTER_ID_LOGIN_BACKEND, { agent });

        const principal = await actorLoginBackend.get_principal_client();
        setPrincipalText(principal);
        setIsLoggedIn(true);
        navigate('/tarefas');

      },
      windowOpenerFeatures: `
        left=${window.screen.width / 2 - 525 / 2},
        top=${window.screen.height / 2 - 705 / 2},
        toolbar=0,location=0,menubar=0,width=525,height=705
      `,
    });

    return false;
  }

  async function logout() {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setPrincipalText("");
    setIsLoggedIn(false);
  }

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="py-8 px-4 mx-auto max-w-screen-sm text-center lg:py-16">
        <img src="/logo2.svg" alt="DFINITY logo" className="mx-auto mb-6 w-24 h-auto" />

        <h1 className="mb-4 text-3xl font-bold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">Autenticação</h1>

        <p className="mb-8 text-md font-normal text-gray-500 dark:text-gray-400">Faça login com Internet Identity para continuar</p>

        <div className="flex flex-col items-center space-y-4">
          {!isLoggedIn && (
            <button
              id="login"
              onClick={login}
              className="inline-flex items-center justify-center px-5 py-3 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Login com Internet Identity
            </button>
          )}

          {isLoggedIn && (
            <button
              id="logout"
              onClick={logout}
              className="inline-flex items-center justify-center px-5 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
            >
              Logout
            </button>
          )}

          {principalText && (
            <label
              id="principalText"
              className="mt-4 text-sm text-gray-700 dark:text-gray-300 break-all"
            >
              {principalText}
            </label>
          )}
        </div>
      </div>
    </section>
  );
}

export default Login;
