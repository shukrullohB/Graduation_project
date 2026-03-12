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
      <h2>{question?.title}</h2>
      <div className="question-body">
        <p>{question?.description}</p>
      </div>
    </div>
  );
}
