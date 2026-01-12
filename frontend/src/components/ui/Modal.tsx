import { Component, JSX, Show, onMount, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
    let modalRef: HTMLDivElement | undefined;

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && props.isOpen) {
            props.onClose();
        }
    };

    onMount(() => {
        document.addEventListener('keydown', handleEscape);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', handleEscape);
    });

    return (
        <Show when={props.isOpen}>
            <Portal>
                <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div
                        ref={modalRef}
                        class="bg-f1-carbon border border-f1-carbon-light rounded-lg shadow-xl w-full max-w-lg transform transition-all"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div class="flex items-center justify-between p-4 border-b border-f1-carbon-light">
                            <h3 class="text-lg font-bold text-white uppercase tracking-wide">
                                {props.title}
                            </h3>
                            <button
                                onClick={props.onClose}
                                class="text-f1-silver hover:text-white transition-colors"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div class="p-4 sm:p-6">
                            {props.children}
                        </div>
                    </div>
                </div>
            </Portal>
        </Show>
    );
};

export default Modal;
