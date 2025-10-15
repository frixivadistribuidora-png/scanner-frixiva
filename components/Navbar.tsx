import React from 'react';
import { ScannerIcon } from './icons/ScannerIcon';
import { ArchiveBoxIcon } from './icons/ArchiveBoxIcon';

interface NavbarProps {
    page: 'scanner' | 'inventory';
    setPage: (page: 'scanner' | 'inventory') => void;
}

const Navbar: React.FC<NavbarProps> = ({ page, setPage }) => {
    const navButtonClasses = "flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors duration-300";
    const activeClasses = "bg-cyan-600 text-white";
    const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

    return (
        <nav className="w-full max-w-4xl mx-auto mb-8 bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl shadow-2xl border border-gray-700 flex justify-center gap-2">
            <button
                onClick={() => setPage('scanner')}
                className={`${navButtonClasses} ${page === 'scanner' ? activeClasses : inactiveClasses}`}
            >
                <ScannerIcon className="h-5 w-5" />
                <span>Scanner</span>
            </button>
            <button
                onClick={() => setPage('inventory')}
                className={`${navButtonClasses} ${page === 'inventory' ? activeClasses : inactiveClasses}`}
            >
                <ArchiveBoxIcon className="h-5 w-5" />
                <span>Inventario</span>
            </button>
        </nav>
    );
};

export default Navbar;
