import styles from "./QuantitiesTable.module.css";

const rows = [
  ["1.1", "Excavate foundation trench, 600 mm wide, 1,000 mm deep", "7.98", "m³"],
  ["1.2", "Concrete trench-fill foundation, 600 mm wide, 850 mm deep", "6.78", "m³"],
  ["2.1", "Insulated ground-bearing floor slab", "19.80", "m²"],
  ["3.1", "Cavity wall, facing brick outer leaf, net of openings", "25.80", "m²"],
  ["3.2", "Form 4,100 mm opening in existing rear wall", "1", "item"],
  ["4.1", "Flat roof covering, net of roof lantern", "20.64", "m²"],
  ["4.2", "Roof lantern, 2,100 × 1,500 mm", "1", "nr"],
  ["5.1", "Bi-fold door set, 3,000 × 2,100 mm", "1", "nr"],
];

/** Quantities measured from the illustrative rear-extension plan. */
export function QuantitiesTable({ caption = "Illustrative excerpt: measured quantities" }: { caption?: string }) {
  return (
    <div className={styles.wrap} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Ref.</th>
            <th scope="col">Item</th>
            <th scope="col" className={styles.num}>Qty</th>
            <th scope="col">Unit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([ref, item, qty, unit]) => (
            <tr key={ref}>
              <td className={styles.ref}>{ref}</td>
              <td>{item}</td>
              <td className={styles.num}>{qty}</td>
              <td className={styles.unit}>{unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
