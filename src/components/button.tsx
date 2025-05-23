type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-lg border border-neutral-400 px-4 py-2 text-sm font-semibold text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-600 enabled:hover:border-transparent enabled:hover:bg-neutral-600 enabled:hover:text-white disabled:bg-neutral-300 ${className}`}
    ></button>
  );
}
