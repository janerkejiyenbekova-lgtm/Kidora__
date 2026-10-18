export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <rect width="64" height="64" rx="18" fill="#17140b" />
      <g className="bloom">
        <g transform="translate(32 32)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-12.5" rx="7" ry="11" transform={`rotate(${a})`} fill="#FFC93C" />
          ))}
        </g>
        <circle cx="32" cy="32" r="5.5" fill="#ffffff" />
      </g>
    </svg>
  );
}
