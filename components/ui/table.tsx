import * as React from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

export function Table({ className = "", ...props }: TableProps) {
  return (
    <table
      className={
        "w-full border-collapse text-sm text-left " + className
      }
      {...props}
    />
  );
}

type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableHeader({ className = "", ...props }: TableHeaderProps) {
  return (
    <thead className={"bg-gray-50 " + className} {...props} />
  );
}

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className = "", ...props }: TableBodyProps) {
  return <tbody className={className} {...props} />;
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export function TableRow({ className = "", ...props }: TableRowProps) {
  return (
    <tr className={"border-b last:border-0 " + className} {...props} />
  );
}

type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export function TableHead({ className = "", ...props }: TableHeadProps) {
  return (
    <th
      className={
        "px-3 py-2 font-medium text-gray-700 border-b " + className
      }
      {...props}
    />
  );
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export function TableCell({ className = "", ...props }: TableCellProps) {
  return (
    <td className={"px-3 py-2 align-middle " + className} {...props} />
  );
}
