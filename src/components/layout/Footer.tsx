export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-3 px-6 w-full">
      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
        <span>&copy; {year}</span>
        <span className="text-gray-300">|</span>
        <span>
          Powered by{' '}
          <span className="font-semibold text-[#0f256e]">Nurovia</span>
        </span>
        <span className="text-gray-300">|</span>
        <span>
          Designed &amp; Developed by{' '}
          <span className="font-semibold text-[#0f256e]">Hassan El-Deghidy</span>
        </span>
      </div>
    </footer>
  );
}
