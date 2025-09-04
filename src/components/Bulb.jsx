const VARIANTS = {
  Urgent: {
    on: "bg-red-400 ring-red-600",
    ping: "bg-red-200",
    glow: "drop-shadow-red-400",
    text: "text-red-500",
  },
  High: {
    on: "bg-yellow-400 ring-yellow-600",
    ping: "bg-yellow-200",
    glow: "drop-shadow-yellow-400",
    text: "text-yellow-500",
  },
  Medium: {
    on: "bg-green-400 ring-green-600",
    ping: "bg-green-200",
    glow: "drop-shadow-green-400",
    text: "text-green-500",
  },
  Low: {
    on: "bg-blue-500 ring-blue-600",
    ping: "bg-blue-200",
    glow: "drop-shadow-blue-400",
    text: "text-blue-500",
  },
};

const SIZES = {
  sm: "h-1.5 w-1.5",
  md: "h-3.5 w-3.5",
  lg: "h-5 w-5",
};
const LABELS = {
  Urgent: "URGENT",
  High: "High",
  Medium: "Medium",
  Low: "low",
};

export default function Bulb({
  on = true,
  variant = "Low",
  size = "sm",
  label,
  pulse = false,
  className = "",
}) {
  const v = VARIANTS[variant];
  const sz = SIZES[size];

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      {/* Bulb */}
      <span className={`text-sm font-light text-gray-500`}>
        {LABELS[variant]}
      </span>
      <span
        aria-hidden
        className={`relative inline-flex rounded-full ring-2  transition-all duration-100 ${sz} ${
          on ? v.on : "bg-gray-300 ring-gray-300"
        } ${on && pulse ? v.glow : ""}`}
      >
        {/* Pulse effect */}
        {on && pulse && (
          <span
            className={`absolute inset-0 rounded-full opacity-75 animate-ping ${v.ping}`}
          />
        )}
      </span>

      {/* Screen-reader status */}
      <span role="status" className="sr-only">
        {`${LABELS[variant]}: ${on ? "on" : "off"}`}
      </span>
    </span>
  );
}
