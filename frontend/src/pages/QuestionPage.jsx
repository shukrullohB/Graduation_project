import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchQuestionById } from "../api/questions.api";

const QuestionPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["question", id],
    queryFn: () => fetchQuestionById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="page">
        <p className="muted">Loading question…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page">
        <p className="error">Unable to load this question.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Question</p>
          <h1>{data.title}</h1>
        </div>
        <Link className="btn" to={`/questions/${data.id}/answer`}>
          Submit Answer
        </Link>
      </div>
      <div className="card">
        <p>{data.body}</p>
      </div>
      {data.rubric && (
        <div className="card">
          <h3>Rubric</h3>
          <p className="muted">{data.rubric}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
