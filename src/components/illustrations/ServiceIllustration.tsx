import type { IllustrationKey } from "@/content/services";
import styles from "./ServiceIllustration.module.css";

/** Line illustrations for each service. All use currentColor. Illustrative only. */

function BeamDiagram() {
  const arrows = Array.from({ length: 11 }, (_, i) => 70 + i * 26);
  // Bending moment parabola: M(x) ∝ x(L - x), drawn below the baseline.
  const curve = Array.from({ length: 29 }, (_, i) => {
    const t = i / 28;
    return `${(60 + t * 280).toFixed(1)},${(196 + 4 * t * (1 - t) * 52).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 400 280" className={styles.svg} aria-hidden="true" focusable="false">
      {/* Distributed load */}
      <line className={styles.thin} x1="60" y1="66" x2="340" y2="66" />
      {arrows.map((x) => (
        <g key={x} className={styles.arrow}>
          <line x1={x} y1="66" x2={x} y2="94" />
          <path d={`M${x - 4} 88 L${x} 96 L${x + 4} 88`} />
        </g>
      ))}
      <text className={styles.label} x="60" y="54">w = uniformly distributed load</text>

      {/* Beam in elevation */}
      <rect className={styles.beam} x="52" y="100" width="296" height="14" rx="1" />
      <line className={styles.thin} x1="52" y1="104" x2="348" y2="104" />
      <line className={styles.thin} x1="52" y1="110" x2="348" y2="110" />

      {/* Supports: pin and roller */}
      <path className={styles.stroke} d="M60 114 L50 132 H70 Z" />
      <path className={styles.stroke} d="M340 114 L330 128 H350 Z" />
      <circle className={styles.stroke} cx="334" cy="133" r="3" />
      <circle className={styles.stroke} cx="346" cy="133" r="3" />
      <line className={styles.ground} x1="40" y1="138" x2="80" y2="138" />
      <line className={styles.ground} x1="320" y1="138" x2="360" y2="138" />

      {/* Span */}
      <line className={styles.thin} x1="60" y1="160" x2="340" y2="160" />
      <path className={styles.stroke} d="M56 164 L64 156 M336 164 L344 156" />
      <text className={styles.label} x="200" y="154" textAnchor="middle">L = 6.0 m</text>

      {/* Bending moment diagram */}
      <line className={styles.thin} x1="60" y1="196" x2="340" y2="196" />
      <polygon className={styles.fill} points={`60,196 ${curve} 340,196`} />
      <polyline className={styles.stroke} points={curve} />
      <line className={styles.dashed} x1="200" y1="196" x2="200" y2="248" />
      <text className={styles.label} x="210" y="270">M max = wL² / 8</text>
    </svg>
  );
}

function PlanMini() {
  return (
    <svg viewBox="0 0 400 280" className={styles.svg} aria-hidden="true" focusable="false">
      {/* Dimension string */}
      <line className={styles.thin} x1="44" y1="22" x2="356" y2="22" />
      <path className={styles.stroke} d="M40 26 L48 18 M196 26 L204 18 M352 26 L360 18" />
      <text className={styles.label} x="122" y="16" textAnchor="middle">4200</text>
      <text className={styles.label} x="278" y="16" textAnchor="middle">4200</text>

      {/* External walls */}
      <path className={styles.wall} d="M44 36 H356 V256 H44 Z" />
      {/* Internal walls */}
      <path className={styles.wallThin} d="M200 36 V150 M200 186 V256 M44 150 H150 M180 150 H200" />
      {/* Door swings */}
      <path className={styles.thin} d="M150 150 A30 30 0 0 1 180 120" />
      <line className={styles.thin} x1="180" y1="150" x2="180" y2="120" />
      <path className={styles.thin} d="M200 186 A30 30 0 0 0 230 156" />
      <line className={styles.thin} x1="200" y1="156" x2="230" y2="156" />
      {/* Windows */}
      <g className={styles.window}>
        <rect x="90" y="33" width="64" height="6" />
        <rect x="250" y="33" width="64" height="6" />
        <rect x="353" y="170" width="6" height="56" />
      </g>
      {/* Kitchen units */}
      <rect className={styles.fill} x="210" y="44" width="138" height="20" />
      <rect className={styles.thin} x="210" y="44" width="138" height="20" />

      <text className={styles.room} x="120" y="96" textAnchor="middle">LIVING</text>
      <text className={styles.room} x="278" y="110" textAnchor="middle">KITCHEN</text>
      <text className={styles.room} x="120" y="210" textAnchor="middle">BEDROOM</text>
      <text className={styles.room} x="278" y="226" textAnchor="middle">DINING</text>

      {/* North point */}
      <g transform="translate(374 244)">
        <circle className={styles.thin} r="10" />
        <path className={styles.solid} d="M0 -8 L4 6 L0 3 L-4 6 Z" />
      </g>
    </svg>
  );
}

function QuantitiesMini() {
  const rows = [
    ["1.1", 132, "7.98", "m³"],
    ["2.1", 98, "19.80", "m²"],
    ["3.1", 150, "25.80", "m²"],
    ["4.1", 116, "20.64", "m²"],
    ["5.1", 84, "1", "nr"],
  ] as const;
  const bars = [62, 40, 88, 54, 28];
  return (
    <svg viewBox="0 0 400 280" className={styles.svg} aria-hidden="true" focusable="false">
      <rect className={styles.sheet} x="24" y="24" width="250" height="232" rx="8" />
      <rect className={styles.fill} x="24" y="24" width="250" height="32" rx="8" />
      <text className={styles.head} x="40" y="45">REF</text>
      <text className={styles.head} x="76" y="45">ITEM</text>
      <text className={styles.head} x="204" y="45">QTY</text>
      <text className={styles.head} x="244" y="45">UNIT</text>
      {rows.map(([ref, width, qty, unit], i) => {
        const y = 82 + i * 36;
        return (
          <g key={ref} className={i === 2 ? styles.rowHot : undefined}>
            {i === 2 && <rect className={styles.fill} x="30" y={y - 18} width="238" height="28" rx="4" />}
            <text className={styles.cell} x="40" y={y}>{ref}</text>
            <rect className={styles.bar} x="76" y={y - 8} width={width - 30} height="6" rx="3" />
            <text className={styles.cell} x="228" y={y} textAnchor="end">{qty}</text>
            <text className={styles.cell} x="244" y={y}>{unit}</text>
            {i < rows.length - 1 && <line className={styles.hair} x1="36" y1={y + 14} x2="262" y2={y + 14} />}
          </g>
        );
      })}

      {/* Cost breakdown */}
      <text className={styles.head} x="296" y="45">COST SPLIT</text>
      <line className={styles.thin} x1="296" y1="236" x2="380" y2="236" />
      {bars.map((h, i) => (
        <rect key={i} className={i === 2 ? styles.solid : styles.barOutline} x={300 + i * 16} y={236 - h * 1.8} width="10" height={h * 1.8} rx="2" />
      ))}
      <text className={styles.label} x="296" y="256">by element</text>
    </svg>
  );
}

export function ServiceIllustration({ name, className }: { name: IllustrationKey; className?: string }) {
  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      {name === "frame" && <BeamDiagram />}
      {name === "plan" && <PlanMini />}
      {name === "quantities" && <QuantitiesMini />}
    </div>
  );
}
