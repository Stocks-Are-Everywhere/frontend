const Navigation = () => {
  return (
    <nav className="flex gap-2">
      {["홈", "주식", "투자내역", "자산"].map((label, i) => (
        <a
          key={i}
          className={`text-sm px-2 py-1 transition-all hover:text-gray-900 hover:border-b-2 hover:border-blue-500 ${
            label === "주식" ? "font-bold text-gray-800" : "text-gray-400 font-medium"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;