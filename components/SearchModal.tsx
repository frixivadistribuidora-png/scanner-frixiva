
import React from 'react';
import type { ProductRecord } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SearchResult {
  text: string;
  sources: { uri: string; title: string }[];
}

interface SearchModalProps {
  product: ProductRecord | null;
  isOpen: boolean;
  onClose: () => void;
  searchResult: SearchResult | null;
  isSearching: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({ product, isOpen, onClose, searchResult, isSearching }) => {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white truncate pr-4">
            {product.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none flex-shrink-0">&times;</button>
        </header>

        <div className="p-6 overflow-y-auto">
          {isSearching && (
            <div className="flex flex-col items-center justify-center gap-4 text-gray-300">
              <SpinnerIcon className="h-8 w-8 animate-spin text-cyan-400" />
              <p>Searching the web for information...</p>
            </div>
          )}

          {searchResult && !isSearching && (
            <div className="text-gray-300 space-y-4">
              <p className="whitespace-pre-wrap">{searchResult.text}</p>
              
              {searchResult.sources && searchResult.sources.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-200">Sources:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {searchResult.sources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                        >
                          {source.title || source.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
