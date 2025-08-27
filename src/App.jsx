"use client"

import { useState, useEffect, useRef } from "react"

export default function App() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [showHearts, setShowHearts] = useState(false)
  const [showLoveNote, setShowLoveNote] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [showWishes, setShowWishes] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (currentStep < 3) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), currentStep === 0 ? 2000 : 4000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            name: file.name,
            id: Date.now() + Math.random()
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then(newImages => {
      setUploadedImages(prev => [...prev, ...newImages])
    })
  }

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  const FloatingElement = ({ emoji, delay = 0, index }) => {
    const startX = (index % 3) * (windowSize.width / 3) + Math.random() * 200

    return (
      <div
        className="absolute opacity-70 hover:opacity-100 transition-opacity duration-300 animate-float"
        style={{
          left: `${startX}px`,
          top: `${windowSize.height + 50}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${8 + Math.random() * 4}s`,
        }}
      >
        <span className="text-xl sm:text-2xl">{emoji}</span>
      </div>
    )
  }

  const ConfettiHeart = ({ index }) => (
    <div
      className="absolute text-pink-400 animate-confetti-fall"
      style={{
        left: `${Math.random() * windowSize.width}px`,
        top: "-50px",
        animationDelay: `${index * 0.1}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    >
      <span className="text-base sm:text-xl">💖</span>
    </div>
  )

  // Updated HangingPhoto component to display images
  const HangingPhoto = ({ index, imageUrl, caption, rotation, onRemove }) => {
    const positionX = (index % 5) * (windowSize.width / 5) + Math.random() * 100
    const positionY = 50 + Math.random() * 100
    
    return (
      <div
        className="absolute flex flex-col items-center justify-center animate-sway group"
        style={{
          left: `${positionX}px`,
          top: `${positionY}px`,
          transform: `rotate(${rotation}deg)`,
          animationDelay: `${index * 0.5}s`,
          animationDuration: `${8 + Math.random() * 4}s`,
        }}
      >
        {/* String */}
        <div className="h-12 w-0.5 bg-gradient-to-b from-yellow-200 to-transparent mb-1"></div>
        
        {/* Photo frame with image */}
        <div className="relative bg-white p-1 rounded-lg shadow-lg border-2 border-yellow-300 transform hover:scale-110 transition-transform duration-300">
          <img 
            src={imageUrl} 
            alt={caption} 
            className="w-16 h-16 object-cover rounded-md"
          />
          <button 
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            ×
          </button>
          <div className="text-xs text-center text-gray-700 font-medium mt-1 max-w-[70px] truncate">{caption}</div>
        </div>
      </div>
    )
  }

  const StarField = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(windowSize.width < 640 ? 20 : 35)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )

  const LoveNote = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={() => setShowLoveNote(false)}
    >
      <div
        className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 w-full max-w-md lg:max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-rose-300 relative animate-scale-in transform-gpu"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 text-xl transition-colors duration-200 hover:scale-110 transform"
          onClick={() => setShowLoveNote(false)}
        >
          ✕
        </button>

        <div className="text-center">
          <div className="text-rose-500 text-4xl md:text-5xl mb-4 animate-bounce">💌</div>
          <h3 className="text-xl md:text-2xl font-bold text-rose-600 mb-4 leading-tight">My Heart's Letter to You</h3>
          <div className="text-gray-700 text-sm md:text-base text-left leading-relaxed border-l-4 border-rose-300 pl-4 my-6 bg-rose-50/70 p-4 rounded-r-lg">
            <p className="mb-3 italic">"My dearest love,</p>
            <p className="mb-3">
              Every sunrise reminds me of your beautiful smile, and every sunset makes me wish I could hold you close.
            </p>
            <p className="mb-3">
              Today, on your special day, I want you to know that you are cherished beyond words.
            </p>
            <p className="mb-3">
            Wishing you the happiest birthday! Hope your day is filled with smiles, surprises, and all the things you love most.
            </p>
            <p className="italic">Happy Birthday, my beautiful soul. You deserve all the happiness in the world."</p>
          </div>
          <p className="text-rose-500 font-semibold text-sm md:text-base">- Always Loves You💖</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="animate-pulse text-2xl">💕</div>
            <div className="animate-pulse text-2xl" style={{ animationDelay: "0.5s" }}>
              ✨
            </div>
            <div className="animate-pulse text-2xl" style={{ animationDelay: "1s" }}>
              💕
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PhotoGallery = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={() => setShowPhotoGallery(false)}
    >
      <div
        className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 w-full max-w-2xl p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-pink-300 relative animate-scale-in transform-gpu max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 text-xl transition-colors duration-200 hover:scale-110 transform z-10"
          onClick={() => setShowPhotoGallery(false)}
        >
          ✕
        </button>

        <div className="text-center">
          <div className="text-pink-500 text-4xl md:text-5xl mb-4 animate-bounce">📸</div>
          <h3 className="text-xl md:text-2xl font-bold text-rose-600 mb-6 leading-tight">Our Beautiful Memories</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { emoji: "🌅", caption: "Our first sunrise together" },
              { emoji: "🌹", caption: "The day you stole my heart" },
              { emoji: "🎭", caption: "Laughing until our sides hurt" },
              { emoji: "🌙", caption: "Stargazing and dreaming" },
              { emoji: "🎵", caption: "Dancing to our favorite song" },
              { emoji: "☕", caption: "Morning coffee conversations" },
            ].map((memory, index) => (
              <div
                key={index}
                className="bg-white/60 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform"
              >
                <div className="text-4xl mb-2 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                  {memory.emoji}
                </div>
                <p className="text-sm text-gray-700 font-medium">{memory.caption}</p>
              </div>
            ))}
          </div>

          <p className="text-pink-500 font-semibold text-sm md:text-base italic">
            "Every moment with you becomes a treasured memory 💝"
          </p>
        </div>
      </div>
    </div>
  )

  const BirthdayWishes = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={() => setShowWishes(false)}
    >
      <div
        className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-yellow-300 relative animate-scale-in transform-gpu max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-orange-400 hover:text-orange-600 text-xl transition-colors duration-200 hover:scale-110 transform"
          onClick={() => setShowWishes(false)}
        >
          ✕
        </button>

        <div className="text-center">
          <div className="text-orange-500 text-4xl md:text-5xl mb-4 animate-bounce">🎂</div>
          <h3 className="text-xl md:text-2xl font-bold text-orange-600 mb-6 leading-tight">
            My Birthday Wishes for You
          </h3>

          <div className="space-y-4 text-left">
            {[
              { icon: "🌟", wish: "May your dreams shine brighter than the stars" },
              { icon: "🦋", wish: "May you always find reasons to smile and laugh" },
              { icon: "🌈", wish: "May every day bring you new adventures and joy" },
              { icon: "💎", wish: "May you always know how precious you are to me" },
              { icon: "🌸", wish: "May your heart be filled with endless love and happiness" },
              { icon: "✨", wish: "May all your birthday wishes come true, my love" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-white/50 rounded-xl shadow-sm hover:bg-white/70 transition-colors duration-300"
              >
                <span className="text-2xl mr-4 animate-bounce" style={{ animationDelay: `${index * 0.3}s` }}>
                  {item.icon}
                </span>
                <p className="text-gray-700 font-medium leading-relaxed">{item.wish}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0.7; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-50px) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
          50% { text-shadow: 0 0 40px rgba(255,192,203,0.8), 0 0 60px rgba(255,192,203,0.6); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-down {
          0% { transform: translateY(-50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.1); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
        
        @keyframes sway {
          0% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
          100% { transform: rotate(-5deg); }
        }
        
        .animate-float { animation: float linear infinite; }
        .animate-confetti-fall { animation: confetti-fall ease-out forwards; }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        .animate-sway { animation: sway ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["🌹", "💝", "🦋", "⭐", "🌙", "💫", "🎀", "🎁", "💐", "🕊️", "🌺", "💍"].map((emoji, i) => (
          <FloatingElement key={i} emoji={emoji} delay={i * 0.4} index={i} />
        ))}
        {showHearts && [...Array(50)].map((_, i) => <ConfettiHeart key={i} index={i} />)}
        
        {/* Hanging photo frames with uploaded images */}
        {uploadedImages.map((image, index) => (
          <HangingPhoto 
            key={image.id}
            index={index}
            imageUrl={image.url}
            caption={image.name.split('.')[0]} // Use filename without extension as caption
            rotation={index % 2 === 0 ? -3 : 2}
            onRemove={() => removeImage(image.id)}
          />
        ))}
        
        {/* Default hanging frames if no images uploaded */}
        {uploadedImages.length === 0 && [
          
          { emoji: "🎂", caption: "Birthday", rotation: 2 },
          { emoji: "💕", caption: "Love", rotation: -4 },
          { emoji: "💑", caption: "Us", rotation: -3 },
          { emoji: "🌹", caption: "Romance", rotation: 5 },
          { emoji: "⭐", caption: "Special", rotation: -2 },
        ].map((photo, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center justify-center animate-sway"
            style={{
              left: `${(index % 5) * (windowSize.width / 5) + Math.random() * 100}px`,
              top: `${50 + Math.random() * 100}px`,
              transform: `rotate(${photo.rotation}deg)`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {/* String */}
            <div className="h-12 w-0.5 bg-gradient-to-b from-yellow-200 to-transparent mb-1"></div>
            
            {/* Photo frame */}
            <div className="bg-white p-2 rounded-lg shadow-lg border-2 border-yellow-300 transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl mb-1">{photo.emoji}</div>
              <div className="text-xs text-center text-gray-700 font-medium max-w-[60px]">{photo.caption}</div>
            </div>
          </div>
        ))}
      </div>

      <StarField />

      {/* Image upload button */}
      {/* {currentStep >= 3 && (
        <div className="fixed bottom-4 right-4 z-20">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/90 hover:bg-white text-pink-600 font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 flex items-center"
          >
            <span className="mr-2">📸</span>
            Add Photos
          </button>
        </div>
      )} */}

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        {currentStep === 0 && (
          <div className="text-white animate-slide-up">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 drop-shadow-2xl animate-glow">
              🎊 SURPRISE! 🎊
            </h1>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/30 shadow-xl animate-scale-in">
              <p className="text-lg sm:text-xl lg:text-2xl opacity-95 leading-relaxed">
                The most amazing person in the world has a birthday today...
              </p>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="text-white animate-slide-down">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-yellow-200 via-pink-300 to-rose-300 bg-clip-text text-transparent drop-shadow-2xl animate-heartbeat">
              🎂 HAPPY BIRTHDAY 🎂
            </h1>
            <p className="text-xl sm:text-3xl lg:text-4xl text-yellow-100 font-bold drop-shadow-lg">
              💖 To My Beautiful, Amazing Girlfriend 💖
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-slide-up">
            <div className="bg-white/25 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/40 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-yellow-200 drop-shadow-lg">
                Though We're Miles Apart, You're Always in My Heart
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center text-lg sm:text-xl lg:text-2xl p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                  <span className="mr-4 text-2xl">🌟</span>
                  <span>You light up my world from thousands of miles away</span>
                </div>
                <div className="flex items-center text-lg sm:text-xl lg:text-2xl p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                  <span className="mr-4 text-2xl">💝</span>
                  <span>Every moment with you feels like a precious gift</span>
                </div>
                <div className="flex items-center text-lg sm:text-xl lg:text-2xl p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                  <span className="mr-4 text-2xl">🌈</span>
                  <span>You make every day brighter and more beautiful</span>
                </div>
                {/* <div className="flex items-center text-lg sm:text-xl lg:text-2xl p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                  <span className="mr-4 text-2xl">💕</span>
                  <span>Distance is just a number when love is this strong</span>
                </div> */}
              </div>
            </div>
          </div>
        )}

        {currentStep >= 3 && (
          <div className="animate-slide-up">
            <div className="bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-rose-500/30 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/40 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-yellow-200 drop-shadow-lg animate-glow">
                💌 A Love Letter From My Heart 💌
              </h2>

              <div className="italic text-pink-100 text-lg sm:text-xl lg:text-2xl border-t border-b border-pink-200/40 py-6 mb-6 bg-white/10 rounded-lg backdrop-blur-sm">
                "Distance means so little when someone means so much to your heart..."
              </div>

              <div className="grid gap-4 sm:gap-6 bg-white/15 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
                {[
                  { emoji: "🌟", text: "Every morning I wake up grateful for your love" },
                  { emoji: "💕", text: "Your messages make my heart flutter with joy" },
                  { emoji: "🦋", text: "I dream of the day I can hold you in my arms" },
                  { emoji: "✨", text: "Until then, you're always dancing in my thoughts" },
                  { emoji: "🌹", text: "You are my greatest blessing and deepest love" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-left text-base sm:text-lg lg:text-xl p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-4 text-2xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {item.emoji}
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-300 mb-8 animate-heartbeat">
                Happy Birthday, My Beautiful Love! 🎉💖✨
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
                <button
                  className="group px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  onClick={() => setShowLoveNote(true)}
                >
                  <span className="group-hover:animate-bounce inline-block">💌</span>
                  <span className="mx-2">Read Love Letter</span>
                </button>

                <button
                  className="group px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  onClick={() => setShowWishes(true)}
                >
                  <span className="group-hover:animate-bounce inline-block">🎂</span>
                  <span className="mx-2">Birthday Wishes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLoveNote && <LoveNote />}
      {showPhotoGallery && <PhotoGallery />}
      {showWishes && <BirthdayWishes />}
    </div>
  )
}