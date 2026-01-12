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
                        viewBox="0 0 280 80"
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
                            F1 Logo - Two similar shapes
                            Top bar: Full-size parallelogram with curved left edge
                            Bottom bar: Same shape, scaled down (~60%) and positioned below
                        */}

                        {/* Top bar - Curved banana/gun shape */}
                        <path
                            d="M22 28
                               C22 18 30 10 42 10
                               L175 10
                               L160 28
                               L50 28
                               C38 28 30 32 28 38
                               L28 40
                               L12 40
                               C10 36 12 30 22 28
                               Z"
                            fill="url(#f1-gradient)"
                            class="opacity-0 animate-[slideLeft_0.5s_cubic-bezier(0.4,0,0.2,1)_0.2s_forwards]"
                        />

                        {/* Bottom bar - Same curved shape, scaled down */}
                        <path
                            d="M18 58
                               C18 50 24 44 34 44
                               L115 44
                               L103 58
                               L40 58
                               C30 58 24 62 22 66
                               L22 68
                               L10 68
                               C8 64 10 60 18 58
                               Z"
                            fill="url(#f1-gradient)"
                            class="opacity-0 animate-[slideRight_0.5s_cubic-bezier(0.4,0,0.2,1)_0.4s_forwards]"
                        />

                        {/* The "1" - diagonal pillar on the right */}
                        <path
                            d="M180 8 L210 8 L195 62 L165 62 Z"
                            fill="url(#f1-gradient)"
                            class="opacity-0 animate-[slideUp_0.5s_cubic-bezier(0.4,0,0.2,1)_0.5s_forwards]"
                        />

                        {/* TM Mark */}
                        <text x="212" y="68" fill="white" font-family="Arial" font-weight="bold" font-size="8" class="opacity-0 animate-[fadeIn_1s_ease_1.0s_forwards]">TM</text>
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
