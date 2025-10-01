import { useEffect, useState } from "react";

function TypingMessage({ content, speed = 15, onFinish }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText((prev) => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        if (onFinish) onFinish();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, onFinish]);

  return <>{displayedText}</>;
}

export default TypingMessage;
