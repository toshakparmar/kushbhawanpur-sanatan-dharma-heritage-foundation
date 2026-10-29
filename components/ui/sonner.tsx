"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-paper group-[.toaster]:text-ink group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-muted text-xs",
          actionButton:
            "group-[.toast]:bg-saffron-deep group-[.toast]:text-cream font-medium",
          cancelButton:
            "group-[.toast]:bg-sand group-[.toast]:text-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
