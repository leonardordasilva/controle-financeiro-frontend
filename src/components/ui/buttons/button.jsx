export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium shadow hover:brightness-110 transition duration-150 ${className}`}
    >
      {children}
    </button>
  );
}
