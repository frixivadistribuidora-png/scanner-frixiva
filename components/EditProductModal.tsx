import React, { useState, useEffect, useRef } from 'react';
import type { ProductRecord } from '../types';
import { PhotoIcon } from './icons/PhotoIcon';

interface EditProductModalProps {
    product: ProductRecord;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: ProductRecord) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<ProductRecord>(product);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Reset form state to match the passed-in product whenever the modal is opened.
    // This fixes a bug where stale data could persist if the modal was reopened
    // for the same product after being edited and closed without saving.
    useEffect(() => {
        if (isOpen) {
            setFormData(product);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    // Derived state: check if the form data is different from the original product.
    const hasChanges = JSON.stringify(product) !== JSON.stringify(formData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const handleClose = () => {
        // If there are changes and the user cancels the confirmation prompt, do nothing.
        if (hasChanges && !window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?")) {
            return;
        }
        // Otherwise, close the modal.
        onClose();
    };


    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">Editar Producto</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none flex-shrink-0">&times;</button>
                </header>
                <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                             <label className="block text-sm font-medium text-gray-300 mb-2">Imagen del Producto</label>
                             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                     {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Product" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                     ) : (
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                                     )}
                                    <div className="flex text-sm text-gray-500 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-cyan-500 px-3 py-1">
                                            <span>Subir un archivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" ref={imageInputRef} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label htmlFor="barcode" className="block text-sm font-medium text-gray-300">Código de Barras</label>
                                <input type="text" id="barcode" value={formData.barcode} readOnly className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre del Producto</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" required />
                            </div>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
                                <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                         <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Existencias</label>
                            <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} min="0" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="cost" className="block text-sm font-medium text-gray-300">Costo</label>
                            <input type="number" name="cost" id="cost" value={formData.cost || 0} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio de Venta</label>
                            <input type="number" name="price" id="price" value={formData.price || 0} onChange={handleChange} min="0" step="0.01" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-300">Ubicación</label>
                            <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                        </div>
                    </div>
                </form>
                <footer className="flex-shrink-0 px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
                    <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500">Cancelar</button>
                    <button type="submit" onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500">Guardar Cambios</button>
                </footer>
            </div>
        </div>
    );
};

export default EditProductModal;