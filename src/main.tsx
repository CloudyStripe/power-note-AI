
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { SignOn } from './firebase/auth/SignOn.tsx';
import { AccountCreation } from './firebase/auth/AccountCreationForm.tsx';

const firebaseConfig = {
  apiKey: "AIzaSyAVQPWxAYvl9EhWyizIrLJy54-Lg1kZ_mI",
  authDomain: "power-note-ai-406218.firebaseapp.com",
  projectId: "power-note-ai-406218",
  storageBucket: "power-note-ai-406218.appspot.com",
  messagingSenderId: "398811340868",
  appId: "1:398811340868:web:bdcf33f9aabd2145591c11",
  measurementId: "G-GCNF7T3E2K"
};

initializeApp(firebaseConfig);

const router = createHashRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "/signOn",
      element: <SignOn/>
    },
    {
      path: "/createAccount",
      element: <AccountCreation/>
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
