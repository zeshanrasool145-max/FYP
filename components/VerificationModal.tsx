
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, Shield, Upload, X, Loader2, ScanFace, CreditCard } from 'lucide-react';

interface VerificationModalProps {
  onClose: () => void;
  onComplete: (cnic: string) => void;
}

type Step = 'INTRO' | 'CNIC_FRONT' | 'CNIC_BACK' | 'SELFIE' | 'PROCESSING' | 'SUCCESS';

export const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('INTRO');
  const [cnicNumber, setCnicNumber] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const image = canvas.toDataURL('image/jpeg');
      setSelfieImage(image);
      
      // Stop stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'FRONT' | 'BACK') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'FRONT') setFrontImage(reader.result as string);
        else setBackImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processVerification = () => {
    setStep('PROCESSING');
    // Simulate biometric matching
    setTimeout(() => {
      setStep('SUCCESS');
      // Simulate success delay
      setTimeout(() => {
        onComplete(cnicNumber);
      }, 1500);
    }, 4000); // 4 seconds processing time
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {step !== 'SUCCESS' && step !== 'PROCESSING' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="p-8">
          {/* STEP 1: INTRO */}
          {step === 'INTRO' && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-agri-100 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-agri-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify Identity</h2>
              <p className="text-gray-500">
                To ensure a secure marketplace, we need to verify your CNIC and match it with a live photo.
              </p>
              
              <div className="space-y-4 text-left bg-gray-50 p-4 rounded-xl text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-agri-500" />
                  <span>1. Upload CNIC Front & Back</span>
                </div>
                <div className="flex items-center gap-3">
                  <ScanFace className="w-5 h-5 text-agri-500" />
                  <span>2. Take a Real-Time Selfie</span>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-agri-500" />
                  <span>3. AI Biometric Matching</span>
                </div>
              </div>

              <button 
                onClick={() => setStep('CNIC_FRONT')}
                className="w-full bg-agri-600 text-white font-bold py-3 rounded-xl hover:bg-agri-700 transition"
              >
                Start Verification
              </button>
            </div>
          )}

          {/* STEP 2 & 3: CNIC UPLOAD */}
          {(step === 'CNIC_FRONT' || step === 'CNIC_BACK') && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-agri-600" />
                Upload CNIC {step === 'CNIC_FRONT' ? 'Front' : 'Back'}
              </h2>
              
              <div className="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-agri-400 transition cursor-pointer">
                {(step === 'CNIC_FRONT' ? frontImage : backImage) ? (
                  <img 
                    src={(step === 'CNIC_FRONT' ? frontImage : backImage) as string} 
                    className="w-full h-full object-cover" 
                    alt="CNIC" 
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-agri-500" />
                    <span className="text-sm text-gray-500">Tap to Upload Photo</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, step === 'CNIC_FRONT' ? 'FRONT' : 'BACK')}
                />
              </div>

              {step === 'CNIC_FRONT' && (
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Enter CNIC Number</label>
                   <input 
                     type="text" 
                     placeholder="35301-1234567-1"
                     className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-agri-500"
                     value={cnicNumber}
                     onChange={(e) => setCnicNumber(e.target.value)}
                   />
                </div>
              )}

              <button 
                disabled={step === 'CNIC_FRONT' ? (!frontImage || !cnicNumber) : !backImage}
                onClick={() => setStep(step === 'CNIC_FRONT' ? 'CNIC_BACK' : 'SELFIE')}
                className="w-full bg-agri-600 text-white font-bold py-3 rounded-xl hover:bg-agri-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          )}

          {/* STEP 4: SELFIE */}
          {step === 'SELFIE' && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <ScanFace className="w-6 h-6 text-agri-600" />
                Face Verification
              </h2>
              
              <div className="relative mx-auto w-64 h-64 rounded-full overflow-hidden bg-black border-4 border-agri-500 shadow-xl">
                 {!selfieImage ? (
                   <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                      {!stream && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                          <button onClick={startCamera} className="flex flex-col items-center">
                            <Camera className="w-8 h-8 mb-2" />
                            <span>Start Camera</span>
                          </button>
                        </div>
                      )}
                   </>
                 ) : (
                    <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover transform scale-x-[-1]" />
                 )}
                 <canvas ref={canvasRef} className="hidden" />
              </div>

              <p className="text-sm text-gray-500">
                Please look directly at the camera and ensure your face is well-lit.
              </p>

              {!selfieImage ? (
                 <button 
                  onClick={captureSelfie}
                  disabled={!stream}
                  className="w-full bg-agri-600 text-white font-bold py-3 rounded-xl hover:bg-agri-700 transition disabled:opacity-50"
                 >
                   Capture Photo
                 </button>
              ) : (
                 <div className="space-y-3">
                   <button 
                    onClick={processVerification}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
                   >
                     Submit for Verification
                   </button>
                   <button 
                    onClick={() => { setSelfieImage(null); startCamera(); }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                   >
                     Retake Photo
                   </button>
                 </div>
              )}
            </div>
          )}

          {/* STEP 5: PROCESSING */}
          {step === 'PROCESSING' && (
            <div className="text-center py-10 space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                 <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-agri-500 rounded-full border-t-transparent animate-spin"></div>
                 <ScanFace className="absolute inset-0 m-auto w-10 h-10 text-agri-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verifying Identity...</h3>
                <p className="text-gray-500 text-sm">Comparing facial features with CNIC photo.</p>
                <p className="text-xs text-gray-400 mt-4">Please wait, this may take a moment.</p>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === 'SUCCESS' && (
             <div className="text-center py-10 space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h3>
                  <p className="text-gray-500">Your identity has been verified. You can now access all premium features.</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};