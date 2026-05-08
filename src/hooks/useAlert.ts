'use client';
import { useCallback, useState } from 'react';

export function useAlert() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertValue, setAlertValue] = useState('');

    const triggerAlert = useCallback((message: string) => {
        setAlertValue(message);
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 2000);
    }, []);

    return {
        showAlert,
        alertValue,
        triggerAlert,
    };
}
