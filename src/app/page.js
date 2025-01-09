"use client";
import Form from "./components/Form";
import CaptchaComponent from "./components/CaptchaComponent";

import { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState([]);
  const [isCaptchaVisible, setCaptchaVisible] = useState(false);

  const handleFormSubmit = (N) => {
    setOutput([]);
    setCaptchaVisible(false);

    const fetchSequence = async (current) => {
      if (current > N) return;

      try {
        const response = await fetch("https://api.prod.jcloudify.com/whoami");
        if (response.status === 405) {
          throw new Error("CaptchaRequired");
        } else if (!response.ok) {
          throw new Error("Forbidden");
        }
        const data = await response.text();
        setOutput((prevOutput) => [...prevOutput, `${current}. ${data}`]);
        setTimeout(() => fetchSequence(current + 1), 1000);
      } catch (error) {
        if (error.message === "CaptchaRequired") {
          handleCaptcha().then(() => {
            setTimeout(() => fetchSequence(current), 1000);
          });
        } else if (error.message === "Forbidden") {
          setOutput((prevOutput) => [
            ...prevOutput,
            `${current}. Forbidden`,
          ]);
          setTimeout(() => fetchSequence(current + 1), 1000);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchSequence(1);
  };

  const handleCaptcha = () => {
    return new Promise((resolve) => {
      setCaptchaVisible(true);
      window.captchaResolved = resolve;
    });
  };

  const captchaSuccess = () => {
    const container = document.getElementById("my-captcha-container");
    if (container) container.style.display = 'none';
    if (window.captchaResolved) window.captchaResolved();
  };

  const captchaError = (error) => {
    console.error("CAPTCHA error:", error);
  };

  return (
    <div>
      <h1>Générateur de Séquence</h1>
      <Form onSubmit={handleFormSubmit} />
      <div id="output">
        {output.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {isCaptchaVisible && (
        <CaptchaComponent onSuccess={captchaSuccess} onError={captchaError} />
      )}
    </div>
  );
}
