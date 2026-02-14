import React, { useState, useRef, useEffect } from 'react';
// Lưu ý: Đảm bảo tên file thực tế là Background.tsx (chữ B hoa)
import Background from './components/Background';
import PasscodeScreen from './components/PasscodeScreen';
import MessageScreen from './components/MessageScreen';
import ValentineWorld from './components/ValentineWorld';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [show3DWorld, setShow3DWorld] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const CORRECT_PIN = "1402";

  // Kiểm tra xoay màn hình
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleStart = async () => {
    try {
      const doc = document.documentElement as any;
      if (doc.requestFullscreen) {
        await doc.requestFullscreen();
      } else if (doc.webkitRequestFullscreen) {
        await doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) {
        await doc.msRequestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen denied", err);
    }
    
    setHasInteracted(true);
    toggleMusic(true);
  };

  const handleUnlock = (pin: string) => {
    if (pin === CORRECT_PIN) {
      setIsUnlocked(true);
    } else {
      const screen = document.getElementById('passcode-container');
      screen?.classList.add('animate-shake');
      setTimeout(() => screen?.classList.remove('animate-shake'), 500);
    }
  };

  const toggleMusic = (forcePlay = false) => {
    if (!audioRef.current) {
      // Đường dẫn /nguoiamphu.mp3 sẽ lấy từ thư mục public
      audioRef.current = new Audio('/nguoiamphu.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }

    if (forcePlay || !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 1. Màn hình nhắc xoay ngang
  if (hasInteracted && isPortrait) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
        <div className="w-20 h-20 mb-6 border-4 border-[#c5a059] rounded-xl flex items-center justify-center animate-spin-slow">
            <svg className="w-10 h-10 text-[#c5a059] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        </div>
        <h2 className="text-2xl font-display text-[#c5a059] mb-4">Vui lòng xoay ngang điện thoại</h2>
        <p className="text-white/60 font-serif-luxury text-lg">Để có trải nghiệm tuyệt vời nhất nhé ❤️</p>
      </div>
    );
  }

  // 2. Màn hình Intro
  if (!hasInteracted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <Background />
        <div className="z-10 flex flex-col items-center gap-8 animate-fadeInUp">
          <div className="space-y-2">
            <p className="text-[#c5a059] tracking-[0.3em] uppercase text-xs">Valentine 14/2</p>
            <h1 className="text-4xl md:text-6xl font-display italic text-white">Tui có một món quà tặng bạn nè 💕</h1>
          </div>
          <button 
            onClick={handleStart}
            className="group relative px-10 py-4 bg-transparent border border-[#c5a059]/50 text-[#c5a059] overflow-hidden rounded-full transition-all duration-500 hover:scale-105"
          >
            <span className="relative font-serif-luxury text-xl font-bold tracking-wider flex items-center gap-3">Mở điiii</span>
          </button>
          <p className="text-white/30 text-xs mt-4">Hãy bật xoay ngang màn hình trước khi bắt đầu!</p>
        </div>
      </div>
    );
  }

  // 3. Màn hình chính
  return (
    <div className="relative w-full h-screen overflow-hidden text-white bg-[#050505]">
      {!show3DWorld && <Background />}
      
      <div className="relative z-10 w-full h-full">
        {show3DWorld ? (
          <ValentineWorld onBack={() => setShow3DWorld(false)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 animate-fadeIn">
            {!isUnlocked ? (
              <div id="passcode-container">
                <PasscodeScreen onUnlock={handleUnlock} />
              </div>
            ) : (
              <MessageScreen onGoToWorld={() => setShow3DWorld(true)} />
            )}
          </div>
        )}
      </div>

      {/* Nút điều khiển nhạc */}
      <button 
        onClick={() => toggleMusic()}
        className="fixed bottom-8 left-8 z-50 group flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 p-2 pr-6 rounded-full transition-all duration-500"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isPlaying ? 'bg-[#c5a059] rotate-[360deg]' : 'bg-white/10'}`}>
          {isPlaying ? (
             <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
             <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Bật Nhạc</span>
          <span className="text-sm font-semibold text-[#c5a059]">{isPlaying ? 'Đang Phát...' : 'Tạm Dừng'}</span>
        </div>
      </button>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;