import type { SVGProps } from "react";

const paths = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  phone: (
    <path d="M6.6 3h3l1.5 4.5-2.2 1.4a11 11 0 0 0 6.2 6.2l1.4-2.2L21 14.4v3A2.6 2.6 0 0 1 18.4 20C10.5 19.5 4.5 13.5 4 5.6A2.6 2.6 0 0 1 6.6 3z" />
  ),
  whatsapp: (
    <>
      <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6z" />
      <path d="M9.2 8.8c.2 3 2.6 5.6 5.8 6l1-1.3-1.8-1-1 .8a4.5 4.5 0 0 1-2.4-2.4l.8-1-1-1.8z" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  scale: (
    <>
      <rect x="3" y="12" width="6" height="8" rx="1" />
      <rect x="11" y="4" width="10" height="16" rx="1" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
    </>
  ),
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />,
};

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

/** Arrow used inside buttons; nudges right on hover via .btn__arrow. */
export function ArrowIcon() {
  return <Icon name="arrow-right" className="btn__arrow" />;
}
