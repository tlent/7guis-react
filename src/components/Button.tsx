type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-24 rounded-full border border-neutral-200 px-4 py-1 text-sm font-semibold text-neutral-600 hover:border-transparent hover:bg-neutral-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
    ></button>
  );
}
