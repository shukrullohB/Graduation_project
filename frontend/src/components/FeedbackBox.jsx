const FeedbackBox = ({ title = "Feedback", text }) => (
  <div className="feedback-box">
    <div className="feedback-box__title">{title}</div>
    <p className="feedback-box__text">{text || "No feedback yet."}</p>
  </div>
);

export default FeedbackBox;
