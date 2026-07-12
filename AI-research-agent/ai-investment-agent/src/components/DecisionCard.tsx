interface DecisionCardProps {
  decision: string;
}

export default function DecisionCard({
  decision,
}: DecisionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">

      <h2 className="text-xl font-bold mb-3">
        Final Recommendation
      </h2>

      <div
        className={`text-3xl font-bold ${
          decision === "INVEST"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {decision}
      </div>

    </div>
  );
}