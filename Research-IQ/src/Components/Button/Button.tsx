import React from "react";

type Theme = "light" | "dark";

const theme = {
  light: {
    bg: "#F3C94B",
    text: "#111111",
    border: "#111111",
    shadow: "#111111",
  },
  dark: {
    bg: "#D4A82A",
    text: "#111111",
    border: "#E8E0D0",
    shadow: "#E8E0D0",
  },
};

interface ButtonProps {
  children: React.ReactNode;
  mode?: Theme;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
}

export default function Button({
  children,
  mode = "light",
  className = "",
  onClick
}: ButtonProps) {
  const t = theme[mode];

  return (
    <button
      style={
        {
          "--btn-bg": t.bg,
          "--btn-text": t.text,
          "--btn-border": t.border,
          "--btn-shadow": t.shadow,
        } as React.CSSProperties
      }
      className={`
        bg-[var(--btn-bg)]
        text-[var(--btn-text)]
        border-[var(--btn-border)]

        border-[3px]
        rounded-xl
        px-4 py-2.5

        font-mono
        text-sm
        font-bold
        tracking-[0.03em]

        inline-flex
        items-center
        justify-center

        shadow-[4px_4px_0_var(--btn-shadow)]

        transition-all
        duration-200

        hover:-translate-x-[1px]
        hover:-translate-y-[1px]
        hover:shadow-[6px_6px_0_var(--btn-shadow)]

        active:translate-x-[2px]
        active:translate-y-[2px]
        active:shadow-[2px_2px_0_var(--btn-shadow)]

        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}