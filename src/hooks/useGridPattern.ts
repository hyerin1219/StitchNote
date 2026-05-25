import { useEffect, useState } from 'react';
import { IGirdPattern, IGridPattern2D } from '@/types';
import { useGridPatternStore } from '@/store/useGridPatternStore';
import { useAuth } from './useAuth';

export function useGridPattern() {
    const { patterns, loading, fetchPatterns } = useGridPatternStore();
    const { uid } = useAuth();

    useEffect(() => {
        if (uid) {
            fetchPatterns(uid);
        }
    }, [uid, fetchPatterns]);

    return { data: patterns, loading };
}

export function useGirdPatternDetail(id: string) {
    const { getPatternById, loading } = useGridPatternStore();
    const [pattern, setPattern] = useState<IGridPattern2D | null>(null);
    const { uid } = useAuth();

    useEffect(() => {
        if (uid && id) {
            getPatternById(uid, id).then((res) => {
                if (res) {
                    const items2D = res.items && res.gridWidth ? Array.from({ length: Math.ceil(res.items.length / res.gridWidth) }, (_, i) => res.items.slice(i * res.gridWidth, (i + 1) * res.gridWidth)) : [];

                    setPattern({
                        ...res,
                        items: items2D,
                    });
                } else {
                    setPattern(null);
                }
            });
        }
    }, [uid, id, getPatternById]);

    return { pattern, loading };
}
