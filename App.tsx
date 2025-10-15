import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { ProductRecord } from './types';
import Scanner from './components/Scanner';
import ProductTable from './components/ProductTable';
import CameraSelector from './components/CameraSelector';
import Navbar from './components/Navbar';
import InventoryPage from './components/InventoryPage';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';


const App: React.FC = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [page, setPage] = useState<'scanner' | 'inventory'>('scanner');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [lastScanned, setLastScanned] = useState<{ code: string; time: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchingBarcode, setSearchingBarcode] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleBarcodeDetected = useCallback((barcode: string) => {
    const now = Date.now();
    if (lastScanned && lastScanned.code === barcode && now - lastScanned.time < 3000) {
      return;
    }
    setLastScanned({ code: barcode, time: now });

    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.barcode === barcode);
      if (existingProduct) {
        return prevProducts.map(p => 
            p.barcode === barcode ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        const newProduct: ProductRecord = { 
          barcode, 
          name: 'Producto Escaneado', 
          quantity: 1,
          description: '',
          cost: 0,
          price: 0,
          location: '',
          imageUrl: '',
        };
        return [...prevProducts, newProduct];
      }
    });
    
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }

  }, [lastScanned]);

  const handleUpdateQuantity = (barcode: string, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.barcode === barcode ? { ...p, quantity: newQuantity } : p))
    );
  };

  const handleRemoveProduct = (barcode: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.barcode !== barcode));
  };
  
  const handleUpdateProductDetails = (updatedProduct: ProductRecord) => {
      setProducts(prev => prev.map(p => p.barcode === updatedProduct.barcode ? updatedProduct : p));
  };

  const handleScannerError = useCallback((err: Error) => {
      setError(`Scanner error: ${err.message}. Please try selecting a different camera or refreshing the page.`);
      setIsScanning(false);
  }, []);

  const handleSearchProductInfo = async (barcode: string) => {
    if (searchingBarcode) return; // Prevent multiple searches

    setSearchingBarcode(barcode);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on the web search results for "${barcode} toner", find the most likely product name and a brief description. Respond ONLY with a valid JSON object containing "name" and "description". Example: {"name": "Product Name", "description": "A short description."}. If no clear product information is found, return a JSON object with empty strings for both fields.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const jsonString = text.trim().replace(/^```json\n?/, '').replace(/```$/, '');
      const result = JSON.parse(jsonString);

      if (result.name) {
        setProducts(prev => 
          prev.map(p => 
            p.barcode === barcode 
              ? { ...p, name: result.name, description: result.description || p.description } 
              : p
          )
        );
      } else {
        setError(`No information found for barcode ${barcode}.`);
      }
    } catch (err) {
      console.error("Failed to fetch product info:", err);
      setError(`Failed to fetch info for ${barcode}. Please check the console for details.`);
    } finally {
      setSearchingBarcode(null);
    }
  };


  const getCamerasAndStart = async () => {
    try {
      const getStream = async () => {
        try {
          return await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch (e) {
          console.warn("Could not get environment camera, trying default.", e);
          return await navigator.mediaDevices.getUserMedia({ video: true });
        }
      };
      
      const stream = await getStream();
      stream.getTracks().forEach(track => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((device) => device.kind === 'videoinput');
      setVideoDevices(videoInputs);

      if (videoInputs.length > 0) {
        const backCamera = videoInputs.find(device => device.label.toLowerCase().includes('back'));
        const newDeviceId = backCamera ? backCamera.deviceId : videoInputs[0].deviceId;
        setSelectedDeviceId(newDeviceId);
        setError(null);
        setIsScanning(true);
      } else {
        setError('No camera devices were found on this device.');
      }
    } catch (err: any) {
        console.error("Error accessing camera:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setError("Camera permission was denied. Please grant permission in your browser settings to use the scanner.");
        } else {
            setError("Could not access camera. Ensure permissions are granted and your browser is up to date.");
        }
    }
  };


  const toggleScanning = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      if (videoDevices.length === 0) {
        getCamerasAndStart();
      } else {
        setError(null);
        setIsScanning(true);
      }
    }
  };
  
  const handleSearchOnGoogle = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    const query = product && product.name !== 'Producto Escaneado' ? `${product.name} ${barcode}` : barcode;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  useEffect(() => {
    getCamerasAndStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderScannerPage = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {videoDevices.length > 0 && (
            <CameraSelector
              devices={videoDevices}
              selectedDeviceId={selectedDeviceId}
              onChange={setSelectedDeviceId}
              disabled={isScanning}
            />
        )}
        <button
          onClick={toggleScanning}
          className={`w-full ${videoDevices.length > 0 ? 'md:w-auto' : 'md:w-full'} px-6 py-3 font-semibold rounded-md transition-all duration-300 ease-in-out text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isScanning 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500'}
            disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50
          `}
        >
          {isScanning ? 'Detener Scanner' : 'Iniciar Scanner'}
        </button>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-4 text-center">{error}</div>}

      {isScanning && selectedDeviceId && (
        <div className="mb-6">
          <Scanner 
            selectedDeviceId={selectedDeviceId} 
            onBarcodeDetected={handleBarcodeDetected}
            onError={handleScannerError}
          />
        </div>
      )}

      <ProductTable
        products={products}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveProduct={handleRemoveProduct}
        onSearchProduct={handleSearchOnGoogle}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
       <header className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Inventory Scanner
          </h1>
          <p className="text-gray-400 mt-2">Use your camera to scan barcodes and track stock.</p>
        </header>

      <Navbar page={page} setPage={setPage} />

      <main className="w-full max-w-7xl mx-auto flex-grow">
        {page === 'scanner' ? renderScannerPage() : (
          <InventoryPage 
            products={products}
            onUpdateProduct={handleUpdateProductDetails}
            onRemoveProduct={handleRemoveProduct}
            onSearchProductInfo={handleSearchProductInfo}
            searchingBarcode={searchingBarcode}
          />
        )}
      </main>
      
      <Footer onAboutClick={() => setIsAboutModalOpen(true)} />
      
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </div>
  );
};

export default App;