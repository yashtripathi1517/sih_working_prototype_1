import { Video, Upload, Camera } from 'lucide-react';
import React, { useState } from 'react';

export default function VideoAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log('Selected video file:', file);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2">Video Analysis Setup</h1>
      <p className="text-slate-400 mb-8">Configure camera inputs or upload traffic footage for YOLOv8 processing.</p>

      <div className="bg-surface border border-slate-700 rounded-xl p-12 text-center shadow-lg">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Video size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Simulation Mode Active</h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
          The dashboard is currently running in deterministic simulation mode. This ensures a reliable demonstration for the hackathon without requiring active camera feeds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4 transition-all hover:bg-slate-800">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <Upload size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Upload Footage</h3>
              <p className="text-sm text-slate-500">
                {selectedFile ? selectedFile.name : 'MP4 or AVI formats'}
              </p>
            </div>

            <label className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer text-center block">
              {selectedFile ? 'Change Video' : 'Select Video'}
              <input
                type="file"
                accept="video/mp4,video/avi,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4 transition-all hover:bg-slate-800 opacity-60">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Connect Webcam</h3>
              <p className="text-sm text-slate-500">Live RTSP / USB Camera</p>
            </div>
            <button className="mt-2 w-full py-2 bg-slate-700 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
}