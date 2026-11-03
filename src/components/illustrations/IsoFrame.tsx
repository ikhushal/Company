import type { CSSProperties } from "react";
import styles from "./IsoFrame.module.css";

/**
 * Isometric steel frame: 3 × 2 bays, three storeys, on a gridline system.
 * Generated from an isometric projection so the geometry is exact. Each part
 * is grouped so CSS can "build" the frame in sequence. Illustrative only.
 */

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const S = 88; // px per grid unit
const OX = 250;
const OY = 310;
const H = 0.9; // storey height in grid units (3.3 m)
const BAYS_X = 3;
const BAYS_Y = 2;
const STOREYS = 3;

type Pt = [number, number];
const P = (x: number, y: number, z: number): Pt => [
  +(OX + (x - y) * COS * S).toFixed(1),
  +(OY + (x + y) * SIN * S - z * S).toFixed(1),
];
const line = (a: Pt, b: Pt) => ({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
const poly = (pts: Pt[]) => pts.map((p) => p.join(",")).join(" ");
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const levels = Array.from({ length: STOREYS }, (_, k) => (k + 1) * H);
const xs = Array.from({ length: BAYS_X + 1 }, (_, i) => i);
const ys = Array.from({ length: BAYS_Y + 1 }, (_, j) => j);

export function IsoFrame({ className }: { className?: string }) {
  const columns = xs.flatMap((i) => ys.map((j) => [i, j] as const));
  let beamIndex = 0;

  return (
    <svg
      className={`${styles.frame} ${className ?? ""}`}
      viewBox="0 0 640 600"
      role="img"
      aria-label="Illustration: isometric view of a three-storey steel frame on a gridline system, with floor plates, cross-bracing, pad foundations and level markers."
    >
      {/* Ground gridlines and bubbles */}
      <g className={styles.ground}>
        {xs.map((i) => (
          <line key={`gx${i}`} {...line(P(i, -0.4, 0), P(i, BAYS_Y + 0.7, 0))} />
        ))}
        {ys.map((j) => (
          <line key={`gy${j}`} {...line(P(-0.4, j, 0), P(BAYS_X + 0.7, j, 0))} />
        ))}
        {xs.map((i) => {
          const [cx, cy] = P(i, BAYS_Y + 0.85, 0);
          return (
            <g key={`bx${i}`} className={styles.bubble}>
              <circle cx={cx} cy={cy} r="11" />
              <text x={cx} y={cy + 4}>{"ABCD"[i]}</text>
            </g>
          );
        })}
        {ys.map((j) => {
          const [cx, cy] = P(BAYS_X + 0.85, j, 0);
          return (
            <g key={`by${j}`} className={styles.bubble}>
              <circle cx={cx} cy={cy} r="11" />
              <text x={cx} y={cy + 4}>{j + 1}</text>
            </g>
          );
        })}
      </g>

      {/* Pad foundations */}
      <g className={styles.pads}>
        {columns.map(([i, j]) => (
          <polygon
            key={`pad${i}${j}`}
            points={poly([P(i - 0.2, j - 0.2, -0.04), P(i + 0.2, j - 0.2, -0.04), P(i + 0.2, j + 0.2, -0.04), P(i - 0.2, j + 0.2, -0.04)])}
          />
        ))}
      </g>

      {/* Floor plates */}
      <g className={styles.slabs}>
        {levels.map((z, k) => (
          <polygon
            key={`slab${k}`}
            style={delay(k * 140)}
            points={poly([P(0, 0, z), P(BAYS_X, 0, z), P(BAYS_X, BAYS_Y, z), P(0, BAYS_Y, z)])}
          />
        ))}
      </g>

      {/* Columns */}
      <g className={styles.columns}>
        {columns.map(([i, j], n) => (
          <line key={`col${i}${j}`} pathLength={1} style={delay(n * 45)} {...line(P(i, j, 0), P(i, j, STOREYS * H))} />
        ))}
      </g>

      {/* Beams, level by level */}
      <g className={styles.beams}>
        {levels.map((z, k) => (
          <g key={`lvl${k}`}>
            {ys.map((j) => (
              <line key={`bx${k}${j}`} pathLength={1} style={delay(k * 260 + beamIndex++ * 18)} {...line(P(0, j, z), P(BAYS_X, j, z))} />
            ))}
            {xs.map((i) => (
              <line key={`by${k}${i}`} pathLength={1} style={delay(k * 260 + beamIndex++ * 18)} {...line(P(i, 0, z), P(i, BAYS_Y, z))} />
            ))}
          </g>
        ))}
      </g>

      {/* Cross-bracing: front bay A–B and side bay 1–2 */}
      <g className={styles.brace}>
        {[0, ...levels.slice(0, -1)].map((z0, k) => {
          const z1 = z0 + H;
          return (
            <g key={`br${k}`}>
              <line pathLength={1} style={delay(k * 120)} {...line(P(0, 0, z0), P(1, 0, z1))} />
              <line pathLength={1} style={delay(k * 120 + 60)} {...line(P(1, 0, z0), P(0, 0, z1))} />
              <line pathLength={1} style={delay(k * 120 + 30)} {...line(P(BAYS_X, 0, z0), P(BAYS_X, 1, z1))} />
              <line pathLength={1} style={delay(k * 120 + 90)} {...line(P(BAYS_X, 1, z0), P(BAYS_X, 0, z1))} />
            </g>
          );
        })}
      </g>

      {/* Highlighted beam: gridline C, spanning 1–3 at level 2 */}
      <g className={styles.highlight}>
        <line className={styles.hotBeam} {...line(P(2, 0, H * 2), P(2, BAYS_Y, H * 2))} />
      </g>

      {/* Level datums */}
      <g className={styles.annot}>
        {[0, ...levels].map((z, k) => {
          const [x, y] = P(BAYS_X, 0, z);
          const label = k === 0 ? "Ground" : k === STOREYS ? "Roof" : `Level ${k}`;
          return (
            <g key={`dat${k}`}>
              <line className={styles.leader} x1={x + 10} y1={y} x2={x + 96} y2={y} />
              <path className={styles.datum} d={`M${x + 100} ${y} l-6 -9 h12 z`} />
              <text className={styles.level} x={x + 112} y={y - 2}>{`+${(k * 3.3).toFixed(3)}`}</text>
              <text className={styles.levelName} x={x + 112} y={y + 12}>{label}</text>
            </g>
          );
        })}
        {(() => {
          const a = P(0, BAYS_Y + 0.4, 0);
          const b = P(BAYS_X, BAYS_Y + 0.4, 0);
          const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          return (
            <g>
              <line className={styles.leader} {...line(a, b)} />
              <text className={styles.dim} x={mid[0]} y={mid[1] + 16} transform={`rotate(30 ${mid[0]} ${mid[1] + 16})`}>
                3 × 6000
              </text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
