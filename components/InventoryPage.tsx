import React, { useState } from 'react';
import type { ProductRecord } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import EditProductModal from './EditProductModal';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';

interface InventoryPageProps {
    products: ProductRecord[];
    onUpdateProduct: (updatedProduct: ProductRecord) => void;
    onRemoveProduct: (barcode: string) => void;
    onSearchProductInfo: (barcode: string) => void;
    searchingBarcode: string | null;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ products, onUpdateProduct, onRemoveProduct, onSearchProductInfo, searchingBarcode }) => {
    const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);

    const handleSave = (updatedProduct: ProductRecord) => {
        onUpdateProduct(updatedProduct);
        setEditingProduct(null);
    };

    const handleExportCSV = () => {
        if (products.length === 0) {
            alert("No hay productos para exportar.");
            return;
        }

        const headers = [
            "Código de Barras", "Nombre", "Cantidad", "Descripción",
            "Costo", "Precio de Venta", "Ubicación", "URL de Imagen"
        ];

        const escapeCsvField = (field: any): string => {
            const stringField = String(field ?? '');
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const csvRows = products.map(p =>
            [
                escapeCsvField(p.barcode),
                escapeCsvField(p.name),
                escapeCsvField(p.quantity),
                escapeCsvField(p.description),
                escapeCsvField(p.cost),
                escapeCsvField(p.price),
                escapeCsvField(p.location),
                escapeCsvField(p.imageUrl)
            ].join(',')
        );

        const csvString = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "inventario.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (products.length === 0) {
        return (
            <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Tu inventario está vacío.</h2>
                <p>Ve a la pestaña "Scanner" para empezar a agregar productos.</p>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-7xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Gestión de Inventario</h2>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-200"
                    aria-label="Exportar a CSV"
                >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    <span>Exportar CSV</span>
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Imagen</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Producto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Existencias</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Costo</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Precio Venta</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ubicación</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {products.map(product => (
                            <tr key={product.barcode} className="hover:bg-gray-700/50 transition-colors duration-200">
                                <td className="px-4 py-2">
                                    <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-700 flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
                                        ) : (
                                            <PhotoIcon className="h-8 w-8 text-gray-500" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2 align-top">
                                    <div className="text-sm font-medium text-white">{product.name}</div>
                                    <div className="text-xs text-gray-500 font-mono break-all">{product.barcode}</div>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-400 max-w-xs truncate align-top">{product.description || '-'}</td>
                                <td className="px-4 py-2 text-center text-sm text-white align-top">{product.quantity}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-300 font-mono align-top">${(product.cost || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 text-right text-sm text-gray-300 font-mono align-top">${(product.price || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 text-sm text-gray-400 align-top">{product.location || '-'}</td>
                                <td className="px-4 py-2 text-right align-top">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button onClick={() => onSearchProductInfo(product.barcode)} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait" aria-label="Buscar Información" disabled={!!searchingBarcode}>
                                            {searchingBarcode === product.barcode ? <SpinnerIcon className="h-4 w-4 animate-spin"/> : <SearchIcon className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => setEditingProduct(product)} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-yellow-600 rounded-md transition-colors duration-200" aria-label="Editar" disabled={!!searchingBarcode}>
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => onRemoveProduct(product.barcode)} className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-red-600 rounded-md transition-colors duration-200" aria-label="Eliminar" disabled={!!searchingBarcode}>
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             {editingProduct && (
                 <EditProductModal 
                    isOpen={!!editingProduct}
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleSave}
                 />
             )}
        </div>
    );
};

export default InventoryPage;