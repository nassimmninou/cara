import React, { HTMLProps } from "react";

export interface Props extends HTMLProps<SVGSVGElement> {
  size?: number;
}

export default function UpstashLogo({ height = 20, ...props }: Props) {
  return (
    <>
    <img src="https://png.pngtree.com/png-vector/20230225/ourmid/pngtree-smart-chatbot-cartoon-clipart-png-image_6620453.png"/>
    </>
  );
}
