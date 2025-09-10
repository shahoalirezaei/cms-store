import React from "react";

function Footer() {
  return (
    <footer className="w-full mt-auto z-50 text-center text-sm text-gray-400 py-4 border-t  bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 px-4">
        <span>© {new Date().getFullYear()} CMS-Store — Developed by <strong className="text-gray-600 dark:text-white">Shaho Alirezaei</strong></span>
        <span>📧 shahoalirezaei95@gmail.com</span>
        <span>📞 +98 919 097 3470</span>
        <a
          href="https://github.com/shahoalirezaei"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          GitHub Repo ↗
        </a>
      </div>
    </footer>
  );
}

export default Footer;
