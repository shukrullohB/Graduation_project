import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getQuestion } from "../api/questions.api";

export default function QuestionPage() {
  const { id } = useParams();
  const { data: question, isLoading } = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id).then((r) => r.data),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{question?.title}</div>
            <div className="card-subtitle">Question Detail</div>
          </div>
        </div>
        <p style={{ lineHeight: "1.7", color: "var(--gray-700)" }}>
          {question?.description}
        </p>
      </div>
    </div>
  );
}
