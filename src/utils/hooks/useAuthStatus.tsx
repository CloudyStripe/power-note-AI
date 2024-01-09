import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthStatus = () => {

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('authenticated')
      } else {
        if(chrome.runtime){
          chrome.storage.local.set({ panelOpen: false })
        }
        navigate('/signOn')
      }
    });
    // Clean up subscription on unmount
    return () => unsubscribe();

  }, []);
}