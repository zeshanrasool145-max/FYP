import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Camera, Upload, Save, Trash2, AlertTriangle, User, Loader2 } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { user, updateUserProfile, deleteAccount } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Camera States
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateUserProfile(name, avatar);
    setIsSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    setIsSaving(true);
    await deleteAccount();
    setIsSaving(false);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      // Wait for state update to bind ref
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (err) {
      alert("Could not access camera");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      setAvatar(canvas.toDataURL('image/jpeg'));
      
      // Stop Camera
      if (stream) stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setShowCamera(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
             <div className="relative w-24 h-24 mb-4">
                <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-sm" />
                <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-200 cursor-pointer hover:bg-gray-50">
                   <Upload className="w-4 h-4 text-gray-600" />
                   <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
             </div>
             
             {showCamera ? (
               <div className="fixed inset-0 bg-black z-50 flex flex-col">
                  <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="p-6 flex justify-between items-center bg-black/50 absolute bottom-0 w-full">
                     <button onClick={() => { setShowCamera(false); stream?.getTracks().forEach(t=>t.stop()); }} className="text-white">Cancel</button>
                     <button onClick={takePhoto} className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"></button>
                     <div className="w-10"></div>
                  </div>
               </div>
             ) : (
               <button 
                 onClick={startCamera}
                 className="flex items-center text-sm text-agri-600 font-medium hover:underline"
               >
                 <Camera className="w-4 h-4 mr-1" /> Take Photo
               </button>
             )}
          </div>

          {/* Name Edit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <div className="relative">
               <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-500 outline-none"
               />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Account
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center text-red-800 font-bold mb-2">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Are you sure?
                </div>
                <p className="text-sm text-red-600 mb-3">This action cannot be undone. All your data will be lost.</p>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setShowDeleteConfirm(false)}
                     className="flex-1 py-2 bg-white border border-red-200 text-gray-700 rounded-lg text-sm"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleDelete}
                     className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                   >
                     Yes, Delete
                   </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-agri-600 text-white font-bold py-3 rounded-xl hover:bg-agri-700 transition flex justify-center items-center shadow-lg shadow-agri-100"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};