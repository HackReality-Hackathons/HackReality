// src/components/Crossmint/PayButton.tsx
import React, { useEffect } from 'react';

const CrossmintPayButton: React.FC = () => {
  useEffect(() => {
    const loadCrossmintScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@crossmint/client-sdk-vanilla-ui/dist/index.global.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = initializeCrossmintButton;
      script.onerror = (error) => {
        console.error('Error loading Crossmint script:', error);
      };
      document.body.appendChild(script);
    };

    const initializeCrossmintButton = () => {
      try {
        const buttonContainer = document.getElementById('crossmint-button-container');
        if (buttonContainer) {
          const button = document.createElement('crossmint-pay-button');
          
          const projectId = import.meta.env.PUBLIC_CROSSMINT_PROJECT_ID;
          const environment = import.meta.env.MODE === 'production' ? 'production' : 'staging';
          
          if (!projectId) {
            console.error('Missing PUBLIC_CROSSMINT_PROJECT_ID environment variable');
            return;
          }

          button.setAttribute('projectId', projectId);
          button.setAttribute('collectionId', '4d715ae9-06e1-4c2f-a49a-2ecd2cf31551');
          button.setAttribute('environment', environment);

          // Configuración del NFT
          button.setAttribute('mintConfig', JSON.stringify({
            name: 'HackReality 2024 Participation NFT',
            description: 'This NFT certifies participation in HackReality 2024',
            image: '/Test NFT img/ilustracion.png'
          }));

          // Solo actualizar el recipient cuando se hace clic en el botón
          button.addEventListener('click', () => {
            const recipientInput = document.getElementById('recipient') as HTMLInputElement;
            if (recipientInput) {
              button.setAttribute('recipient', recipientInput.value || '');
            }
          });

          buttonContainer.innerHTML = '';
          buttonContainer.appendChild(button);
        }
      } catch (error) {
        console.error('Error initializing Crossmint button:', error);
      }
    };

    loadCrossmintScript();

    return () => {
      const script = document.querySelector('script[src*="crossmint"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="crossmint-button-container"
      className="mt-4"
      style={{ minHeight: '40px' }}
    />
  );
};

export default CrossmintPayButton;