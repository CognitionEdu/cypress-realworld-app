import * as React from "react";

function SvgLibertyMutualLogo(props: any) {
  return (
    <svg
      width="200"
      height="48"
      viewBox="0 0 200 48"
      style={{ height: "135px" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0" y="0" width="200" height="48" fill="#FFD000" rx="4" />
      <text
        x="100"
        y="30"
        textAnchor="middle"
        fill="#003366"
        fontSize="16"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Liberty Mutual
      </text>
    </svg>
  );
}

export default SvgLibertyMutualLogo;
