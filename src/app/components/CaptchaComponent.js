"use client"
// components/Captcha.js
import { useEffect } from 'react';

const CaptchaComponent = ({ onSuccess, onError }) => {
  useEffect(() => {
    // Fonction pour charger le script du captcha
    const loadCaptchaScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://09bd26e5e726.eu-west-3.captcha-sdk.awswaf.com/09bd26e5e726/jsapi.js";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    // Charger le script et initialiser le captcha
    loadCaptchaScript()
      .then(() => {
        const container = document.getElementById('my-captcha-container');
        if (window.AwsWafCaptcha) {
          window.AwsWafCaptcha.renderCaptcha(container, {
            apiKey: process.env.NEXT_PUBLIC_WAF_API_KEY,
            onSuccess: onSuccess,
            onError: onError,
          });
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du script CAPTCHA :", error);
      });
  }, [onSuccess, onError]);

  return (
    <div>
      <div className="overlay"></div>
      <div id="my-captcha-container" style={{ display: 'block' }}></div>
    </div>
  );
};

export default CaptchaComponent;
