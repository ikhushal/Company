export type IllustrationKey = "frame" | "plan" | "quantities";

export type Service = {
  slug: string;
  name: string;
  index: string;
  /** One line used in cards and menus. */
  summary: string;
  /** Opening paragraph on the service page. */
  lead: string;
  illustration: IllustrationKey;
  highlights: string[];
  scope: { title: string; intro: string; items: string[] };
  deliverables: { title: string; text: string }[];
  inputs: string[];
  notes: { title: string; paragraphs: string[] };
  cta: { title: string; text: string };
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "structural-design",
    name: "Structural design",
    index: "01",
    summary:
      "Calculations and drawings for beams, foundations, extensions, loft conversions and new-build homes, ready for your builder and building control.",
    lead:
      "Structural calculations and drawings for residential and small-to-medium building projects, prepared for your builder to work from and for Building Regulations approval.",
    illustration: "frame",
    highlights: ["Steel and timber beams", "Foundations", "Loft conversions", "New-build homes"],
    scope: {
      title: "What we design",
      intro: "Designs are prepared to the current Eurocodes and their UK National Annexes.",
      items: [
        "Steel and timber beams for new openings and removed load-bearing walls",
        "Single- and two-storey extensions",
        "Loft conversions: floor structure, beams and roof alterations",
        "Foundations for extensions and new buildings",
        "New-build houses and small residential developments",
        "Alterations to existing buildings",
      ],
    },
    deliverables: [
      {
        title: "Structural calculations",
        text: "The design basis, loads and checks for each element, with member sizes and specifications, set out so building control can follow them.",
      },
      {
        title: "Structural drawings",
        text: "AutoCAD drawings showing beam, column and foundation positions, sizes, bearings and connection details for your builder.",
      },
      {
        title: "Answers to building control",
        text: "We respond to questions from building control about our design, and revise it if they ask for changes.",
      },
    ],
    inputs: [
      "Existing drawings or a measured survey of the property, if you have one",
      "Proposed drawings from your architect or designer, or sketches with dimensions",
      "Photographs of the area affected, inside and out",
      "The property address or postcode",
      "Any ground investigation or trial-hole information, for foundation design",
    ],
    notes: {
      title: "Approvals and responsibilities",
      paragraphs: [
        "Structural calculations and drawings are normally submitted to building control, either your local authority or a registered building control approver. We prepare our information for that submission; the approval decision rests with the building control body.",
        "Planning permission and party wall matters are separate from structural design and are not included unless agreed in writing. We do not carry out construction work. Where a site visit is needed, we agree it in the quote.",
      ],
    },
    cta: {
      title: "Request a structural design quote",
      text: "Send your drawings, photographs and a short description of the work. We will confirm what is needed and send a written quote.",
    },
    metaTitle: "Structural design and calculations",
    metaDescription:
      "Structural calculations and drawings for extensions, loft conversions, wall removals and new-build homes, prepared for your builder and Building Regulations.",
  },
  {
    slug: "autocad-plans",
    name: "AutoCAD plans",
    index: "02",
    summary:
      "Accurate, editable AutoCAD drawings: plans, elevations, sections and structural drawings, or your sketches and PDFs converted to CAD.",
    lead:
      "Accurate, editable AutoCAD drawings for homeowners, property developers and structural engineers, drawn from your sketches, PDFs, scans or existing CAD files.",
    illustration: "plan",
    highlights: ["Floor plans", "Elevations and sections", "PDF to CAD", "Revisions"],
    scope: {
      title: "Drawing types",
      intro: "Drawings are produced to scale, dimensioned and organised in layers so that others can work from them.",
      items: [
        "Existing and proposed floor plans",
        "Elevations and sections",
        "Site plans and roof plans",
        "Structural drawings and construction details",
        "As-built drawings",
        "Conversion of sketches, PDFs and scans to AutoCAD",
      ],
    },
    deliverables: [
      {
        title: "PDF to AutoCAD",
        text: "PDFs exported from CAD software can often be converted accurately. Scanned or photographed drawings are redrawn, and key dimensions are checked against the information you provide.",
      },
      {
        title: "Hand sketch to AutoCAD",
        text: "Sketches are redrawn to scale from the dimensions marked on them. Where a dimension is missing, we ask rather than guess.",
      },
      {
        title: "Numbered revisions",
        text: "Every issued drawing carries a revision letter and a short note of what changed, so everyone works from the current version.",
      },
    ],
    inputs: [
      "Sketches with dimensions, PDFs, scans or existing CAD files",
      "Photographs of the property, where it helps",
      "Any layer, title block or sheet standards you work to",
      "The purpose of the drawings, such as planning, building control or construction",
    ],
    notes: {
      title: "Formats and revisions",
      paragraphs: [
        "Drawings are supplied as AutoCAD DWG files for editing and as PDF for review and printing. If you work to particular layer, title block or sheet standards, send them with your enquiry and we will follow them.",
        "Your quote states how many rounds of changes are included. Further changes are quoted before the work is done.",
      ],
    },
    cta: {
      title: "Request a drawing quote",
      text: "Tell us what you need drawn or converted and attach examples if you can. We will confirm the scope, format and timescale in a written quote.",
    },
    metaTitle: "AutoCAD plans and drawings",
    metaDescription:
      "AutoCAD floor plans, elevations, sections, site plans and structural drawings. PDF and hand-sketch to CAD conversion, and numbered drawing revisions.",
  },
  {
    slug: "quantity-surveying",
    name: "Quantity surveying",
    index: "03",
    summary:
      "Cost estimates, material take-offs and Bills of Quantities measured from drawings, with the assumptions written down.",
    lead:
      "Construction cost estimates, material take-offs and Bills of Quantities for property developers, homeowners and house builders. Measured from drawings, with the assumptions written down.",
    illustration: "quantities",
    highlights: ["Cost estimates", "Take-offs", "Bills of Quantities", "Option comparisons"],
    scope: {
      title: "What we prepare",
      intro: "Each estimate is a document you can check, not a single figure.",
      items: [
        "Budget estimates to set a budget or test viability",
        "Detailed cost estimates broken down by building element",
        "Material quantity take-offs for ordering and pricing",
        "Bills of Quantities so every builder prices the same work",
        "Cost comparisons between layouts or specifications",
        "Checks of received quotes against an estimate",
      ],
    },
    deliverables: [
      {
        title: "Measured quantities",
        text: "Quantities measured from the drawings and grouped by building element, so you can see exactly what has been priced.",
      },
      {
        title: "Rates and totals",
        text: "Labour and materials shown separately, with rates and totals for each element.",
      },
      {
        title: "Assumptions in writing",
        text: "Assumptions, exclusions and provisional sums listed clearly, along with items that need input from other professionals.",
      },
    ],
    inputs: [
      "Drawings of the proposed work, or sketches with dimensions",
      "Any specification or finishes information",
      "The project location, as prices vary by region",
      "What is in and out of scope",
      "Your intended timescale",
    ],
    notes: {
      title: "An estimate is not a price",
      paragraphs: [
        "An estimate is a reasoned forecast of likely cost, based on the drawings, specification and prices available when it is prepared. It is not a quotation, and it does not guarantee what the work will cost.",
        "Final costs depend on the builder you appoint, market conditions, the final specification and what is found once work starts, particularly in existing buildings. Each estimate lists its exclusions, such as VAT, professional and statutory fees, and work by others.",
      ],
    },
    cta: {
      title: "Request a cost estimate",
      text: "Send your drawings or a description of the project. We will confirm what information is needed and send a written quote for the estimate.",
    },
    metaTitle: "Quantity surveying",
    metaDescription:
      "Construction cost estimates, material take-offs and Bills of Quantities measured from drawings, with assumptions and exclusions written down.",
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const disciplines = [
  "Steel beams",
  "Foundations",
  "Loft conversions",
  "Extensions",
  "New-build homes",
  "Floor plans",
  "Elevations",
  "Sections",
  "PDF to CAD",
  "Take-offs",
  "Bills of Quantities",
  "Cost estimates",
];
