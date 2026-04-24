import SkeletonBlocks from "./ui/SkeletonBlocks";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="glass-panel p-5 md:p-7" role="status" aria-live="polite">
      <SkeletonBlocks />
      <div className="mt-4 text-sm text-slate-500 dark:text-slate-300">
        {text}
      </div>
    </div>
  );
}
