interface ReasoningCardProps {
  reasoning: string;
}

export default function ReasoningCard({
  reasoning,
}: ReasoningCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      <h2 className="text-xl font-bold mb-3">
        AI Reasoning
      </h2>

      <p className="text-gray-700 leading-7">
        {reasoning}
      </p>

    </div>
  );
}