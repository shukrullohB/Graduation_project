export default function FeedbackBox({ feedback }) {
  if (!feedback) return null;
  return (
    <div className="feedback-box">
      <h4>Feedback</h4>
      <p>{feedback}</p>
    </div>
  );
}
