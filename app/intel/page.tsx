'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

/* ============================================================
   Page
   ============================================================ */
export default function HubPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // Longer splash screen duration
    const contentTimer = setTimeout(() => {
      setIsContentVisible(true);
    }, 3800); // Content fade-in start
    
    return () => {
      clearTimeout(splashTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className="page">
      <div className="bgBase" />
      
      <Navigation />

      <main className="container">
          {showSplash && <SplashScreen />}
          {!showSplash && <ComingSoon isVisible={isContentVisible} />}
      </main>

      <Footer />
      <GlobalStyles />
    </div>
  );
}


/* ============================================================
   Sleek Splash Screen for The Hub
   ============================================================ */
function SplashScreen() {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const timer = setTimeout(() => setIsFadingOut(true), 3000);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
            {isClient && <h1>The Hub</h1>}
            <p>The learning center for everything Control Room.</p>
            <style jsx>{`
                .splash-screen {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    opacity: 1;
                    transition: opacity 0.5s ease-out;
                    z-index: 10;
                }
                .splash-screen.fade-out {
                    opacity: 0;
                }
                h1 {
                    font-family: 'Inter', sans-serif;
                    margin:0 0 12px; font-weight:800;
                    font-size: clamp(40px, 5vw, 56px);
                    letter-spacing:-0.03em; line-height:1.1;
                    background: linear-gradient(180deg, #FFFFFF 70%, #D4C3FF);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 10px 60px rgba(167, 127, 255, 0.2);
                    animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
                }
                p { 
                    color: var(--text-muted);
                    font-size: 18px;
                    max-width: 450px;
                    line-height: 1.6;
                    animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) 0.4s both;
                }

                @keyframes text-focus-in {
                    0% {
                        filter: blur(12px);
                        opacity: 0;
                    }
                    100% {
                        filter: blur(0px);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

/* ============================================================
   Creative, Minimalist & Astonishing "Coming Soon" Content
   ============================================================ */
function ComingSoon({ isVisible }: { isVisible: boolean }) {
    return (
        <div className={`coming-soon-wrapper ${isVisible ? 'visible' : ''}`}>
            <div className="animated-core">
                <div className="core-glow"></div>
                <div className="scanner"></div>
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
                <div className="ring ring-4"></div>
            </div>
            <div className="text-content">
                <h2>Coming Soon</h2>
                <p>We're constructing an advanced intelligence center. The next evolution of Control Room is coming soon.</p>
            </div>
            <style jsx>{`
                .coming-soon-wrapper {
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    transition: opacity 0.8s ease-in-out;
                    pointer-events: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .coming-soon-wrapper.visible {
                    opacity: 1;
                    pointer-events: auto;
                }
                
                .animated-core {
                    --primary-color: #583C87; /* Dark Glassy Purple */
                    --secondary-color: #3C3F4C; /* Deeper Monotone Grey */
                    position: relative;
                    width: 200px;
                    height: 200px;
                    margin-bottom: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .core-glow {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
                    border-radius: 50%;
                    opacity: 0.2;
                    filter: blur(30px);
                    animation: pulse 4s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.2; }
                    50% { transform: scale(1.1); opacity: 0.3; }
                }

                .scanner {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: conic-gradient(from 0deg, transparent 0%, var(--primary-color) 30%, transparent 30.5%);
                    animation: rotate 4s linear infinite;
                    opacity: 0.4;
                }

                .ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 1.5px solid;
                }
                .ring-1 {
                    inset: 0;
                    border-color: var(--secondary-color);
                    border-style: solid;
                    opacity: 0.2;
                }
                .ring-2 {
                    inset: 25%;
                    border-color: var(--secondary-color);
                    border-style: dashed;
                    opacity: 0.3;
                }
                .ring-3 {
                    inset: 40%;
                    border-color: var(--primary-color);
                    border-style: solid;
                    opacity: 0.4;
                }
                .ring-4 {
                    position: absolute;
                    width: 120%;
                    height: 120%;
                    border-color: var(--secondary-color);
                    border-style: dotted;
                    opacity: 0.1;
                }


                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .text-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                h2 {
                    font-family: 'Inter', sans-serif;
                    font-size: 52px;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                }
                p {
                    font-size: 18px;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    max-width: 480px;
                }
            `}</style>
        </div>
    )
}

/* ============================================================
   Global Styles
   ============================================================ */
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');
      
      :root {
        --bg-deep: #05070F;
        --text-primary: #FFFFFF;
        --text-secondary: #b3b8d9;
        --text-muted: #707890;
      }
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      html, body, #__next { height: 100%; } 
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: var(--bg-deep);
        color: var(--text-primary);
        -webkit-font-smoothing: antialiased;
        overflow: hidden; /* Prevent body from ever scrolling */
      }

      .page {
        display: flex;
        flex-direction: column;
        height: 100vh; /* Full viewport height */
        position: relative;
      }

      .bgBase {
        position: fixed; inset: 0; z-index: -2;
        background: var(--bg-deep);
        background-image:
          radial-gradient(circle at 15% 20%, rgba(88, 60, 135, 0.1), transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(60, 63, 76, 0.1), transparent 40%);
      }
      
      .container {
        flex-grow: 1;
        width:100%;
        max-width: 1600px;
        margin: 0 auto;
        padding: 100px 60px 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 0;
      }

    `}</style>
  );
}
