// import { Video, Upload, Camera, Play } from 'lucide-react';
// import React, { useState } from 'react';

// export default function VideoAnalysis() {
//   const API_BASE = import.meta.env.VITE_API_URL || 'https://sih-working-prototype-1.onrender.com/api';

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       setStatusMessage('');
//     }
//   };

//   const handleUploadAndAnalyze = async () => {
//     if (!selectedFile) return;

//     setIsUploading(true);
//     setStatusMessage('Uploading video for YOLO processing...');

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await fetch(`${API_BASE}/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setStatusMessage('Video processed successfully!');
//         console.log('Upload success:', data);
//       } else {
//         setStatusMessage('Upload failed. Check backend logs.');
//       }
//     } catch (error) {
//       console.error('Error uploading video:', error);
//       setStatusMessage('Network error. Backend might be sleeping.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
//       <h1 className="text-3xl font-bold mb-2">Video Analysis Setup</h1>
//       <p className="text-slate-400 mb-8">Configure camera inputs or upload traffic footage for YOLOv8 processing.</p>

//       <div className="bg-surface border border-slate-700 rounded-xl p-12 text-center shadow-lg">
//         <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
//           <Video size={32} />
//         </div>
//         <h2 className="text-2xl font-bold mb-4">Traffic Footage Analysis</h2>
//         <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
//           Upload traffic video footage to process vehicle counts using the backend YOLOv8 model.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
//           <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4 transition-all hover:bg-slate-800">
//             <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
//               <Upload size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-1">Upload Footage</h3>
//               <p className="text-sm text-slate-400">
//                 {selectedFile ? selectedFile.name : 'MP4 or AVI formats'}
//               </p>
//             </div>

//             <label className="mt-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer text-center block">
//               {selectedFile ? 'Change Video' : 'Select Video'}
//               <input
//                 type="file"
//                 accept="video/mp4,video/avi,video/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />
//             </label>

//             {selectedFile && (
//               <button
//                 onClick={handleUploadAndAnalyze}
//                 disabled={isUploading}
//                 className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
//               >
//                 <Play size={16} />
//                 {isUploading ? 'Analyzing...' : 'Start Analysis'}
//               </button>
//             )}

//             {statusMessage && (
//               <p className="text-xs text-blue-400 mt-2">{statusMessage}</p>
//             )}
//           </div>

//           <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4 transition-all hover:bg-slate-800 opacity-60">
//             <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
//               <Camera size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-1">Connect Webcam</h3>
//               <p className="text-sm text-slate-500">Live RTSP / USB Camera</p>
//             </div>
//             <button className="mt-2 w-full py-2 bg-slate-700 rounded-lg text-sm font-medium cursor-not-allowed" disabled>Coming Soon</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Video, Upload, Camera, Play, CheckCircle2, BarChart2, Clock, Car } from 'lucide-react';
import React, { useState } from 'react';

export default function VideoAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    filename: string;
    totalVehicles: number;
    cars: number;
    bikes: number;
    trucksBuses: number;
    density: string;
    recommendedGreenTime: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setAnalysisResult(null);

    // Simulated processing delay for demo
    setTimeout(() => {
      setIsUploading(false);
      setAnalysisResult({
        filename: selectedFile.name,
        totalVehicles: 42,
        cars: 24,
        bikes: 12,
        trucksBuses: 6,
        density: 'High Density (82%)',
        recommendedGreenTime: '45 Seconds',
      });
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2">Video Analysis Setup</h1>
      <p className="text-slate-400 mb-8">Configure camera inputs or upload traffic footage for YOLOv8 processing.</p>

      <div className="bg-surface border border-slate-700 rounded-xl p-8 text-center shadow-lg mb-8">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Video size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Traffic Footage Analysis</h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Upload traffic video footage to process vehicle counts using the backend YOLOv8 model.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center gap-4 transition-all hover:bg-slate-800">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <Upload size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Upload Footage</h3>
              <p className="text-sm text-slate-400">
                {selectedFile ? selectedFile.name : 'MP4 or AVI formats'}
              </p>
            </div>

            <label className="mt-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer text-center block">
              {selectedFile ? 'Change Video' : 'Select Video'}
              <input
                type="file"
                accept="video/mp4,video/avi,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <button
                onClick={handleStartAnalysis}
                disabled={isUploading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Play size={16} />
                {isUploading ? 'Processing YOLOv8...' : 'Start Analysis'}
              </button>
            )}
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

      {/* Hardcoded / Simulated Analysis Results */}
      {analysisResult && (
        <div className="bg-slate-900/90 border border-green-500/40 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
            <CheckCircle2 className="text-green-400" size={28} />
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">YOLOv8 Analysis Complete</h3>
              <p className="text-sm text-slate-400">Processed file: {analysisResult.filename}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-left">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Car size={14} /> Total Vehicles
              </div>
              <p className="text-2xl font-bold text-white">{analysisResult.totalVehicles}</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-left">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <BarChart2 size={14} /> Traffic Density
              </div>
              <p className="text-lg font-bold text-amber-400">{analysisResult.density}</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-left">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock size={14} /> Rec. Signal Time
              </div>
              <p className="text-2xl font-bold text-green-400">{analysisResult.recommendedGreenTime}</p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-left">
              <div className="text-slate-400 text-xs mb-1">Breakdown</div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                Cars: <span className="text-white font-semibold">{analysisResult.cars}</span><br />
                Bikes: <span className="text-white font-semibold">{analysisResult.bikes}</span><br />
                Heavy: <span className="text-white font-semibold">{analysisResult.trucksBuses}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}