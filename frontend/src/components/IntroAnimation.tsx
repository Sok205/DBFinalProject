import { Component, onMount, createSignal } from 'solid-js';

interface IntroAnimationProps {
    onComplete: () => void;
}

const IntroAnimation: Component<IntroAnimationProps> = (props) => {
    const [isExiting, setIsExiting] = createSignal(false);

    onMount(() => {
        // Start exit animation
        setTimeout(() => {
            setIsExiting(true);
        }, 2800);

        // Complete
        setTimeout(() => {
            props.onComplete();
        }, 3500);
    });

    return (
        <div
            class={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${isExiting() ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div class="relative flex flex-col items-center">
                {/*
          Modern F1 Logo Construction (SVG)
          Aspect ratio approx 4:1
        */}
                <div class="relative w-80 md:w-[34rem] overflow-visible">
                    {/* 
                       Reconstructed F1 Logo 
                       Method: Orthogonal Construction + Skew Transform
                       We draw the logo "straight" (as if un-italicized) and apply a skewX transform.
                       The official logo has a very strong slant.
                    */}
                    <svg
                        viewBox="0 0 120 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-full h-full drop-shadow-[0_0_25px_rgba(225,6,0,0.6)]"
                    >
                        <defs>
                            <linearGradient id="f1-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#ff2800" />
                                <stop offset="100%" stop-color="#e10600" />
                            </linearGradient>
                        </defs>

                        {/* 
                            Official F1 Logo Paths
                            Recovered from F1.svg (Wikimedia Commons)
                            Coordinate system: 0 0 120 30
                        */}
                        <g>

                            {/* Top/Left "F" Structure */}
                            <path
                                d="M31.1518125,16.253125 C27.8774375,19.3425 20.7530625,26.263125 16.9130625,30 L-6.25e-05,30 C-6.25e-05,30 13.5524375,16.486875 21.0849375,9.0725 C28.8455625,1.685 32.7143125,0 46.9486875,0 L98.7643125,0 L87.5449375,11.21875 L48.0011875,11.21875 C37.9993125,11.21875 35.7518125,11.911875 31.1518125,16.253125 Z"
                                fill="url(#f1-gradient)"
                                class="opacity-0 animate-[slideLeft_0.5s_cubic-bezier(0.4,0,0.2,1)_0.2s_forwards]"
                            />

                            {/* Bottom Bar - The middle crossbar */}
                            <path
                                d="M85.6986875,13.065 L49.3818125,13.065 C38.3136875,13.065 36.3768125,13.651875 31.6361875,18.3925 C27.2024375,22.82625 20.0005625,30 20.0005625,30 L35.7324375,30 L39.4855625,26.246875 C41.9530625,23.779375 43.2255625,23.52375 48.4068125,23.52375 L75.2405625,23.52375 L85.6986875,13.065 Z"
                                fill="url(#f1-gradient)"
                                class="opacity-0 animate-[slideRight_0.5s_cubic-bezier(0.4,0,0.2,1)_0.4s_forwards]"
                            />

                            {/* The "1" Pillar */}
                            <path
                                d="M89.9999375,30 L119.999937,0 L101.943687,0 L71.9443125,30 L89.9999375,30 Z"
                                fill="url(#f1-gradient)"
                                class="opacity-0 animate-[slideUp_0.5s_cubic-bezier(0.4,0,0.2,1)_0.5s_forwards]"
                            />
                        </g>

                        {/* TM Mark */}
                        <text x="122" y="30" fill="white" font-family="Arial" font-weight="bold" font-size="3" class="opacity-0 animate-[fadeIn_1s_ease_1.0s_forwards]">TM</text>
                    </svg>

                </div>

                {/* Animated Speed Lines / Glitch Effect Overlay */}
                <div class="absolute inset-0 z-20 pointer-events-none mix-blend-overlay">
                    <div class="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>

                {/* Loading Indicator */}
                <div class="mt-8 flex gap-1">
                    <div class="w-2 h-2 rounded-full bg-f1-red animate-[bounce_1s_infinite_0ms]" />
                    <div class="w-2 h-2 rounded-full bg-f1-red animate-[bounce_1s_infinite_200ms]" />
                    <div class="w-2 h-2 rounded-full bg-f1-red animate-[bounce_1s_infinite_400ms]" />
                </div>
            </div>

        </div>
    );
};

export default IntroAnimation;
