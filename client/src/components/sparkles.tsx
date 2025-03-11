import { SVGProps } from "react";

export default function Sparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3L13.4328 9.56718L19.9999 11L13.4328 12.4328L12 19L10.5672 12.4328L4 11L10.5672 9.56718L12 3Z"
        fill="currentColor"
      />
      <path
        d="M12 15L12.866 18.134L16 19L12.866 19.866L12 23L11.134 19.866L8 19L11.134 18.134L12 15Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M20 0L20.7071 2.29289L23 3L20.7071 3.70711L20 6L19.2929 3.70711L17 3L19.2929 2.29289L20 0Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}
