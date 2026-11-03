export type Sector = {
  key: string;
  tab: string;
  name: string;
  short: string;
  summary: string;
  detail: string;
  services: string[];
};

export const sectors: Sector[] = [
  {
    key: "homeowners",
    tab: "Homeowner",
    name: "Homeowners",
    short: "homeowners",
    summary:
      "Extensions, loft conversions, removing internal walls and renovations, where you need structural calculations, drawings or an idea of cost before you appoint a builder.",
    detail:
      "Most home projects that change the structure need calculations for Building Regulations approval, even when planning permission is not required. We design the beams, foundations and other structural elements, produce the drawings your builder needs, and can estimate the likely cost before you ask builders to quote.",
    services: ["structural-design", "autocad-plans", "quantity-surveying"],
  },
  {
    key: "developers",
    tab: "Developer or house builder",
    name: "Property developers and house builders",
    short: "developers",
    summary:
      "Early cost estimates for feasibility, structural design for new-build houses and conversions, drawing packages and take-offs for tendering on small and medium-sized schemes.",
    detail:
      "Early cost and structural advice helps you decide whether a scheme works before committing to detailed design. We provide feasibility estimates, structural design for new-build houses and conversions, and drawing packages and quantities for tendering, scaled to the size of the project.",
    services: ["quantity-surveying", "structural-design", "autocad-plans"],
  },
  {
    key: "consultancies",
    tab: "Engineering firm",
    name: "Engineering consultancies and structural engineers",
    short: "engineering firms",
    summary:
      "Extra capacity when you need it: AutoCAD drafting, structural design support and quantity surveying, on a subcontract basis and to your standards.",
    detail:
      "When your own team is at capacity, we provide AutoCAD drafting, structural design support and quantity surveying on a subcontract basis. We work to your drawing standards and deadlines, and you deal directly with the engineer doing the work.",
    services: ["autocad-plans", "structural-design", "quantity-surveying"],
  },
];
