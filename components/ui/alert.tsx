import * as React from "react";

type AlertProps = React.HTMLAttributes<HTMLDivElement>;

export function Alert({ className = "", ...props }: AlertProps) {
  return (
    <div
      className={
        "border border-gray-200 rounded-md p-3 bg-gray-50 text-sm " + className
      }
      {...props}
    />
  );
}

type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function AlertTitle({ className = "", ...props }: AlertTitleProps) {
  return (
    <h4 className={"font-semibold mb-1 text-gray-900 " + className} {...props} />
  );
}

type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function AlertDescription({
  className = "",
  ...props
}: AlertDescriptionProps) {
  return (
    <p className={"text-gray-600 text-sm " + className} {...props} />
  );
}
