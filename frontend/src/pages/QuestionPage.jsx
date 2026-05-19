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
    <div className="page question-detail-page">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{question?.title}</div>
            <div className="card-subtitle">Question Detail</div>
          </div>
          <span className="badge badge--pending">
            Max Score: {question?.max_score}
          </span>
        </div>
        <p className="question-detail-text">
          {question?.description || question?.prompt}
        </p>
      </div>
    </div>
  );
}
