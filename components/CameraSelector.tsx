
import React from 'react';

interface CameraSelectorProps {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onChange: (deviceId: string) => void;
  disabled: boolean;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({ devices, selectedDeviceId, onChange, disabled }) => {
  if (devices.length === 0) {
    return (
      <p className="text-center text-yellow-400">No camera devices found.</p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <label htmlFor="camera-select" className="text-gray-300 font-medium">
        Camera:
      </label>
      <select
        id="camera-select"
        value={selectedDeviceId}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${devices.indexOf(device) + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CameraSelector;
