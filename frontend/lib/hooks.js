// Custom React hooks for data fetching and state management
import { useState, useEffect, useCallback, useRef } from 'react';
import api from './api';

// Hook for fetching data with loading and error states
export function useFetch(fetchFunction, dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchFunction();
                if (isMounted) {
                    setData(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, dependencies);

    return { data, loading, error };
}

// Hook for session timer
export function useSessionTimer(initialTime = 0) {
    const [elapsedTime, setElapsedTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
    }, [isRunning]);

    const pause = useCallback(() => {
        if (isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }
    }, [isRunning]);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsRunning(false);
        setElapsedTime(0);
    }, []);

    const reset = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsRunning(false);
        setElapsedTime(0);
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        elapsedTime,
        isRunning,
        start,
        pause,
        stop,
        reset,
        formattedTime: formatTime(elapsedTime),
    };
}

// Format seconds to HH:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Hook for wallet balance
export function useWallet() {
    const { data: wallet, loading, error } = useFetch(() => api.getWallet());
    const [balance, setBalance] = useState(0);
    const [lockedAmount, setLockedAmount] = useState(0);

    useEffect(() => {
        if (wallet) {
            setBalance(wallet.balance);
            setLockedAmount(wallet.lockedAmount || 0);
        }
    }, [wallet]);

    const addFunds = useCallback(async (amount) => {
        const result = await api.addFunds(amount);
        if (result.success) {
            setBalance(result.newBalance);
        }
        return result;
    }, []);

    return {
        balance,
        lockedAmount,
        availableBalance: balance - lockedAmount,
        loading,
        error,
        addFunds,
    };
}

export default {
    useFetch,
    useSessionTimer,
    useWallet,
};
