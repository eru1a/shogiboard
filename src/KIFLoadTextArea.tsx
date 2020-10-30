import React, { useState } from "react";

export type KIFLoadTextAreaProps = {
  handleClick: (kif: string) => void;
};

export const KIFLoadTextArea: React.FC<KIFLoadTextAreaProps> = ({ handleClick }) => {
  const [kifText, setKIFText] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <textarea value={kifText} onChange={(e) => setKIFText(e.target.value)} />
      <button onClick={() => handleClick(kifText)}>KIF読み込み</button>
    </div>
  );
};
