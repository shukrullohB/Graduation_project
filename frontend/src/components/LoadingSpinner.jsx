export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
