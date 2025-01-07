import React, { ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: (e: React.MouseEvent) => void;
    onConfirm: (e: React.MouseEvent) => Promise<void>;
    title: string;
    children?: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    const debounceLock = useRef(false)
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black opacity-0 transition-opacity"
                    />

                    {/* Modal content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md p-4 bg-card_background rounded-lg shadow-lg h-[25vh] text-white flex flex-col"
                    >
                        <h2 className="text-xl text-center font-bold  my-2" >{title}</h2>
                        {children}
                        <div className="mt-auto mb-5 flex space-x-4 justify-around">
                            <button
                                onClick={async (e) => {
                                    if (!debounceLock.current) {
                                        debounceLock.current = true
                                        await onConfirm(e)
                                        debounceLock.current = false
                                    }
                                }}
                                className="font-bold bg-button_normal_background border-none rounded-xl min-w-24 h-[34px] mr-8 cursor-pointer hover:bg-button_hover_background"
                            >
                                确定
                            </button>
                            <button
                                onClick={onClose}
                                className="font-bold bg-button_normal_background border-none rounded-xl min-w-24 h-[34px] mr-8 cursor-pointer hover:bg-button_hover_background"
                            >
                                取消
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
};

export default Modal;