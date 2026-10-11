// Red lightning bolt marking breaking stories.
export default function Bolt({ size = 14 }: { size?: number }) {
  return (
    <svg className="bolt-svg" width={size * 0.7} height={size} viewBox="0 0 14 20" aria-hidden="true">
      <path d="M8.5 0 0 11.5h5.5L4 20l10-12.5H8.2z" fill="currentColor" />
    </svg>
  );
}
