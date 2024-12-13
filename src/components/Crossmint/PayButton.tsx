import React, { useState, useEffect, useCallback } from 'react';
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { Icon } from '@iconify/react';
import '../../styles/global.css';
import { authorizedEmails } from '../../lib/validation';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, type User } from 'firebase/auth';
import app from '../../lib/firebase';

export default function PayButton() {
  const [isFirstPlace, setIsFirstPlace] = useState(false);
  const [isSecondPlace, setIsSecondPlace] = useState(false);
  const [isThirdPlace, setIsThirdPlace] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const projectId = import.meta.env.PUBLIC_CROSSMINT_PROJECT_ID;
  
  // Diferentes Collection IDs para cada categoría
  const collectionIds = {
    firstPlace: import.meta.env.PUBLIC_CROSSMINT_COLLECTION_ID_FIRST,
    secondPlace: import.meta.env.PUBLIC_CROSSMINT_COLLECTION_ID_SECOND,
    thirdPlace: import.meta.env.PUBLIC_CROSSMINT_COLLECTION_ID_THIRD,
    participant: import.meta.env.PUBLIC_CROSSMINT_COLLECTION_ID_PARTICIPANT
  };

  // Firebase authentication
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const position = authorizedEmails[currentUser.email as keyof typeof authorizedEmails];
        if (position === 'first') {
          setIsFirstPlace(true);
          setIsSecondPlace(false);
          setIsThirdPlace(false);
          setIsParticipant(true);
        } else if (position === 'second') {
          setIsFirstPlace(false);
          setIsSecondPlace(true);
          setIsThirdPlace(false);
          setIsParticipant(true);
        } else if (position === 'third') {
          setIsFirstPlace(false);
          setIsSecondPlace(false);
          setIsThirdPlace(true);
          setIsParticipant(true);
        } else {
          setIsFirstPlace(false);
          setIsSecondPlace(false);
          setIsThirdPlace(false);
          setIsParticipant(true);
        }
      } else {
        setIsFirstPlace(false);
        setIsSecondPlace(false);
        setIsThirdPlace(false);
        setIsParticipant(false);
      }
    });

    return unsubscribe;
  }, []);

  const getMintConfig = useCallback(() => {
    return {
      type: "erc-721",
      totalPrice: "0",
      quantity: "1"
    };
  }, []);

  // Update Crossmint mint config when user position changes
  useEffect(() => {
    getMintConfig();
  }, [isFirstPlace, isSecondPlace, isThirdPlace, isParticipant, getMintConfig]);

  // Firebase login handlers
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    signInWithPopup(auth, provider);
  };

  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth(app);
    signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 max-w-md w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-block bg-purple-500/20 rounded-full p-3 mb-2">
          <Icon icon="heroicons:cube-transparent" className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Mint your NFT</h2>
        <p className="text-purple-300/80 text-sm">
          Get your exclusive HackReality NFT. Limited time only!
        </p>
      </div>
      <div className="space-y-4 px-4">
        <div className="space-y-2 flex flex-col items-center">
          {!user && (
            <>
              <button className="xmint-btn w-full" onClick={signInWithGoogle}>
                Sign in with Google
              </button>
              <button className="xmint-btn w-full" onClick={signInWithGithub}>
                Sign in with GitHub
              </button>
            </>
          )}
          {user && (
            <>
              <CrossmintPayButton
                projectId={projectId}
                collectionId={collectionIds.firstPlace}
                environment="staging"
                mintConfig={getMintConfig()}
                className="xmint-btn w-full flex items-center justify-center"
                getButtonText={(connecting) =>
                  connecting ? "Connecting..." : "First Place"
                }
                disabled={!isFirstPlace}
              />
              <CrossmintPayButton
                projectId={projectId}
                collectionId={collectionIds.secondPlace}
                environment="staging"
                mintConfig={getMintConfig()}
                className="xmint-btn w-full flex items-center justify-center"
                getButtonText={(connecting) =>
                  connecting ? "Connecting..." : "Second Place"
                }
                disabled={!isSecondPlace}
              />
              <CrossmintPayButton
                projectId={projectId}
                collectionId={collectionIds.thirdPlace}
                environment="staging"
                mintConfig={getMintConfig()}
                className="xmint-btn w-full flex items-center justify-center"
                getButtonText={(connecting) =>
                  connecting ? "Connecting..." : "Third Place"
                }
                disabled={!isThirdPlace}
              />
              <CrossmintPayButton
                projectId={projectId}
                collectionId={collectionIds.participant}
                environment="staging"
                mintConfig={getMintConfig()}
                className="xmint-btn w-full flex items-center justify-center"
                getButtonText={(connecting) =>
                  connecting ? "Connecting..." : "Participant"
                }
                disabled={!isParticipant}
              />
              <button className="bg-red-700 mt-8 w-full rounded-lg p-2 flex items-center justify-center" onClick={handleLogout}>
                <Icon icon="mdi:cross-circle" className="w-6 h-6 mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}