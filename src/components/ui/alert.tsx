'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface IMotionAlertProps {
    alertValue: string;
}

export default function Alert({ alertValue }: IMotionAlertProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    }, []);

    return (
        <AnimatePresence>
            <motion.dialog ref={dialogRef} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 m-auto flex items-center justify-center min-w-[300px] p-0 bg-transparent border-none overflow-visible backdrop:bg-black/40">
                {/* 내부 콘텐츠 박스 */}
                <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center border border-gray-100">
                    <p className="text-gray-800 text-lg font-medium whitespace-pre-wrap">{alertValue}</p>
                </div>
            </motion.dialog>
        </AnimatePresence>
    );
}
