import React from 'react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">¿Cómo funciona esta aplicación?</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none flex-shrink-0">&times;</button>
                </header>
                <div className="p-6 overflow-y-auto text-gray-300 space-y-4">
                    <p>
                        Esta aplicación está diseñada para simplificar la gestión de tu inventario utilizando la cámara de tu dispositivo.
                    </p>
                    
                    <div>
                        <h3 className="font-semibold text-cyan-400">Pestaña "Scanner"</h3>
                        <p className="mt-1">
                            Usa la cámara de tu dispositivo para escanear códigos de barras de forma rápida. Cada vez que escaneas un código, el producto se añade a una lista temporal. Si escaneas el mismo código varias veces, la cantidad se incrementa automáticamente.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-cyan-400">Pestaña "Inventario"</h3>
                        <p className="mt-1">
                           Aquí puedes ver una tabla detallada de todos los productos que has escaneado. Desde esta vista, puedes realizar varias acciones:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Editar Detalles:</strong> Haz clic en el ícono del lápiz para modificar el nombre, descripción, existencias, costo, precio, ubicación y subir una imagen para el producto.</li>
                            <li><strong>Búsqueda Inteligente:</strong> Usa el ícono de la lupa para buscar automáticamente en Google el nombre y la descripción del producto basándose en su código de barras.</li>
                            <li><strong>Eliminar Producto:</strong> Remueve un producto de tu inventario con el ícono del bote de basura.</li>
                        </ul>
                    </div>
                    
                     <div>
                        <h3 className="font-semibold text-cyan-400">Exportar a CSV</h3>
                        <p className="mt-1">
                           En la página de "Inventario", encontrarás un botón "Exportar CSV". Al hacer clic, se descargará un archivo compatible con Excel y Google Sheets que contiene toda la información de tu inventario, permitiéndote analizarla o guardarla como respaldo.
                        </p>
                    </div>

                </div>
                 <footer className="flex-shrink-0 px-6 py-4 border-t border-gray-700 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500">Entendido</button>
                </footer>
            </div>
        </div>
    );
};

export default AboutModal;
