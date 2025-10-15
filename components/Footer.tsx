import React from 'react';

interface FooterProps {
    onAboutClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {
    return (
        <footer className="w-full text-center py-8 mt-8 border-t border-gray-800">
            <p className="text-gray-500">
                <button
                    onClick={onAboutClick}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                    ¿Cómo funciona esta aplicación?
                </button>
            </p>
        </footer>
    );
};

export default Footer;
