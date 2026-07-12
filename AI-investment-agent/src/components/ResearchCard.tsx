interface ResearchCardProps {
  title: string;
  value: string;
}

export default function ResearchCard({
  title,
  value,
}: ResearchCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h3 className="text-gray-500">{title}</h3>

      <p className="text-xl font-semibold mt-2">{value}</p>
    </div>
  );
}