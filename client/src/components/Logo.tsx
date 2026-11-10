export const Logo = ({ size = 24 }: { size?: number }) => (
  <span
    aria-hidden
    className="inline-flex shrink-0 items-center justify-center rounded-md bg-fg font-mono font-bold text-bg"
    style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
  >
    {"</>"}
  </span>
);
