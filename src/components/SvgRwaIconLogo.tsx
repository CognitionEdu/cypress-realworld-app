import * as React from "react";

function SvgLibertyMutualIconLogo(props: any) {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="2" y="2" width="36" height="36" fill="#FFD000" rx="6" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill="#003366"
        fontSize="12"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        LM
      </text>
    </svg>
  );
}

export default SvgLibertyMutualIconLogo;
