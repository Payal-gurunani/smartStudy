import { useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";

const FlashcardCard = ({ flashcard }) => {
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const handleFlip = async () => {
    setFlipped(!flipped);

    if (!reviewed) {
      try {
        await apiRequest({
          method: endpoints.flashcardReview.method,
          url: endpoints.flashcardReview.url,
          data: { flashcardId: flashcard._id },
        });
        setReviewed(true);
      } catch (err) {
        console.error("Failed to log flashcard review", err);
      }
    }
  };

  return (
    <div
 className="relative w-full min-h-[12rem] sm:min-h-[16rem] cursor-pointer [perspective:1000px]"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <p className="text-lg font-semibold text-center">{flashcard.question}</p>
        </div>

        {/* Back */}
<div
  className="absolute w-full h-full bg-green-600 text-white p-4 rounded-lg flex justify-center"
  style={{
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden",
  }}
>
  <div className="overflow-y-auto max-h-full w-full">
    <p className="text-lg text-center whitespace-pre-wrap break-words">{flashcard.answer}</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default FlashcardCard;
