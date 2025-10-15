import React from 'react';
import type { ProductRecord } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PackageIcon } from './icons/PackageIcon';
import { SearchIcon } from './icons/SearchIcon';

interface ProductTableProps {
  products: ProductRecord[];
  onUpdateQuantity: (barcode: string, newQuantity: number) => void;
  onRemoveProduct: (barcode: string) => void;
  onSearchProduct: (barcode: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdateQuantity, onRemoveProduct, onSearchProduct }) => {
  if (products.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400 bg-gray-800 p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">No products scanned yet.</h2>
        <p>Start scanning to add items to your inventory.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {products.map((product) => (
            <tr key={product.barcode} className="hover:bg-gray-700/50 transition-colors duration-200">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-700 flex items-center justify-center">
                      <PackageIcon className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono break-all">{product.barcode}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white">{product.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(product.barcode, Math.max(1, product.quantity - 1))}
                    className="p-1 text-gray-400 hover:text-white bg-gray-700 hover:bg-yellow-600 rounded-full transition-colors duration-200"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onUpdateQuantity(product.barcode, product.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-white bg-gray-700 hover:bg-green-600 rounded-full transition-colors duration-200"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                   <button
                    onClick={() => onSearchProduct(product.barcode)}
                    className="p-1 text-gray-400 hover:text-white bg-gray-700 hover:bg-blue-600 rounded-full transition-colors duration-200"
                    aria-label="Search on Google"
                  >
                    <SearchIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onRemoveProduct(product.barcode)}
                    className="p-1 text-gray-400 hover:text-white bg-gray-700 hover:bg-red-600 rounded-full transition-colors duration-200"
                    aria-label="Remove product"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
