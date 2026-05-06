/** Checkerboard background — used to visualise transparent images */
export function checkerboard(size = 20, color = "#ddd"): React.CSSProperties {
  const h = size / 2;
  return {
    backgroundImage: [
      `linear-gradient(45deg,${color} 25%,transparent 25%)`,
      `linear-gradient(-45deg,${color} 25%,transparent 25%)`,
      `linear-gradient(45deg,transparent 75%,${color} 75%)`,
      `linear-gradient(-45deg,transparent 75%,${color} 75%)`,
    ].join(","),
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `0 0,0 ${h}px,${h}px -${h}px,-${h}px 0`,
  };
}
