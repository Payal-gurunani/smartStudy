import { useState } from "react";

const FlashcardCard = ({ flashcard }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-48 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front side */}
        <div
          className="absolute w-full h-full bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <p className="text-lg font-semibold text-center">{flashcard.question}</p>
        </div>

        {/* Back side */}
        <div
          className="absolute w-full h-full bg-green-600 text-white p-4 rounded-lg flex items-center justify-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <p className="text-lg text-center">{flashcard.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCard;
