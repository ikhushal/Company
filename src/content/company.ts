/** Process and principles shared by the home and about pages. */

export const processSteps = [
  { title: "Enquiry", text: "Tell us about the project and send any drawings, sketches or photographs you have." },
  {
    title: "Written quote",
    text: "We confirm what is needed and send a quote with the scope, deliverables, fee and timescale.",
  },
  {
    title: "Design",
    text: "We prepare the calculations, drawings or estimate. If something is unclear, we ask rather than assume.",
  },
  {
    title: "Your review",
    text: "You review the draft and tell us what needs to change. The quote states the revisions included.",
  },
  {
    title: "Delivery",
    text: "Final documents are issued as PDF and AutoCAD files, ready for your builder and building control.",
  },
];

/** The client's chosen strengths (questionnaire 9.2), written as commitments the practice can keep. */
export const principles = [
  {
    icon: "user",
    title: "Direct contact with the engineer",
    text: "You deal with the engineer doing the work, from the first call to the final drawings, so nothing is lost in hand-overs.",
  },
  {
    icon: "scale",
    title: "Flexible project sizes",
    text: "From a single steel beam for a home renovation to structural design and cost planning for a medium-sized development.",
  },
  {
    icon: "doc",
    title: "Competitive, written quotes",
    text: "A written quote before work starts, setting out the scope, the deliverables and the fee, so there are no surprises.",
  },
  {
    icon: "clock",
    title: "Reliable delivery",
    text: "Timescales agreed at the start, with updates as the work progresses and straight answers if anything changes.",
  },
] as const;
