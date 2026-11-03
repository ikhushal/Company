import type { ReactNode } from "react";

export type FaqItem = { q: string; a: ReactNode };

const planningPortal =
  "https://www.planningportal.co.uk/permission/home-improvement/project-advice/project-advice-extension/planning-permission-and-building-regulations/";

export const commonFaq: FaqItem[] = [
  {
    q: "Do you carry out construction work?",
    a: (
      <p>
        No. Whitestone Civil Engineering is a design consultancy. We prepare the calculations, drawings and cost
        information; your builder or contractor carries out the work.
      </p>
    ),
  },
  {
    q: "What do you need to start a structural design?",
    a: (
      <p>
        Send any drawings you have (existing plans, architect’s drawings or sketches with dimensions), photographs of
        the area, the property address or postcode, and a short description of what you want to change. We will tell
        you if anything else is needed, such as a measured survey or information about the ground.
      </p>
    ),
  },
  {
    q: "Will building control accept your calculations?",
    a: (
      <>
        <p>
          Our structural calculations and drawings are prepared for submission to building control, whether that is
          your local authority or a registered building control approver. We answer their questions about our design.
          The approval decision rests with the building control body.
        </p>
        <p>
          Planning permission is a separate matter. The <a href={planningPortal}>Planning Portal’s guidance</a>{" "}
          explains the difference for projects in England and Wales.
        </p>
      </>
    ),
  },
  {
    q: "Which areas do you cover?",
    a: (
      <p>
        We are based in London and work on projects across England, and we consider projects elsewhere in the UK.
        Much of the work can be done from drawings and photographs. Where a site visit is needed, we agree it in the
        quote.
      </p>
    ),
  },
];

export const allFaq: FaqItem[] = [
  ...commonFaq,
  {
    q: "Is a cost estimate the same as a builder’s quote?",
    a: (
      <p>
        No. An estimate is a reasoned forecast of likely cost based on the drawings and information available. A
        builder’s quote is their offer to do the work for a price. An estimate helps you set a budget and compare
        quotes, but actual prices depend on the builder, the market and the final specification.
      </p>
    ),
  },
  {
    q: "Can you turn my sketches or PDF drawings into AutoCAD files?",
    a: (
      <p>
        Yes. Hand sketches need dimensions marked on them. PDFs exported from CAD software can often be converted
        accurately; scanned drawings are redrawn, and we check key measurements and tell you if a scan is not reliable
        enough to draw from.
      </p>
    ),
  },
  {
    q: "Do you work with other engineering firms?",
    a: (
      <p>
        Yes. We provide AutoCAD drafting, structural design support and quantity surveying to engineering consultancies
        and structural engineers on a subcontract basis, working to your drawing standards where you provide them.
      </p>
    ),
  },
  {
    q: "What file formats do you supply?",
    a: (
      <p>
        Drawings are supplied as PDF for review and printing, and as AutoCAD DWG files for editing. Calculations and
        cost estimates are supplied as PDF.
      </p>
    ),
  },
];
