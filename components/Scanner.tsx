import React, { useEffect, useRef } from 'react';

declare const ZXing: any;

interface ScannerProps {
  selectedDeviceId: string;
  onBarcodeDetected: (barcode: string) => void;
  onError: (error: Error) => void;
}

const Scanner: React.FC<ScannerProps> = ({ 
  selectedDeviceId, 
  onBarcodeDetected, 
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<any>(null);

  // onBarcodeDetected changes frequently, causing this component to re-initialize
  // the scanner unnecessarily. We store it in a ref to keep the effect stable.
  const onBarcodeDetectedRef = useRef(onBarcodeDetected);
  useEffect(() => {
    onBarcodeDetectedRef.current = onBarcodeDetected;
  }, [onBarcodeDetected]);

  useEffect(() => {
    if (!selectedDeviceId) {
      return;
    }

    const hints = new Map();
    const formats = [
        ZXing.BarcodeFormat.QR_CODE,
        ZXing.BarcodeFormat.DATA_MATRIX,
        ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.CODE_39,
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.UPC_E,
        ZXing.BarcodeFormat.ITF,
    ];
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
    codeReaderRef.current = new ZXing.BrowserMultiFormatReader(hints);
    
    const codeReader = codeReaderRef.current;

    const startScanner = async () => {
      try {
        if (videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result: any, err: any) => {
              if (result) {
                onBarcodeDetectedRef.current(result.getText());
              }
              if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error('Barcode scan error:', err);
                onError(err);
              }
            }
          );
        }
      } catch (error) {
        console.error('Error starting scanner:', error);
        onError(error as Error);
      }
    };
    
    startScanner();

    return () => {
      if (codeReader) {
        codeReader.reset();
      }
    };
  }, [selectedDeviceId, onError]);

  return (
    <div className="relative w-full max-w-2xl mx-auto border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg bg-black">
      <video ref={videoRef} className="w-full h-auto" playsInline />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-1/3 border-4 border-red-500 rounded-lg opacity-75" />
      </div>
       <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        Live Scanning...
      </div>
    </div>
  );
};

export default Scanner;