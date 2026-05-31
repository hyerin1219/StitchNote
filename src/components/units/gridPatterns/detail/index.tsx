'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useGirdPatternDetail } from '@/hooks/useGridPattern';

export default function GridPatternsDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { pattern, loading } = useGirdPatternDetail(id);
    const [completedIds, setCompletedIds] = useState<string[]>([]);
    const { uid } = useAuth();

    useEffect(() => {
        if (pattern?.completedIds) {
            setCompletedIds(pattern.completedIds);
        }
    }, [pattern]);

    // 단수 완료 토글
    const handleToggleComplete = async (stepId: string) => {
        if (!uid || !pattern?.id) return;

        const isNow = completedIds.includes(stepId);
        const updated = isNow ? completedIds.filter((v) => v !== stepId) : [...completedIds, stepId];

        setCompletedIds(updated);

        try {
            const docRef = doc(db, 'users', uid, 'GridPatterns', pattern.id);
            await updateDoc(docRef, {
                completedIds: updated,
            });
        } catch (error) {
            console.error('단수 업데이트 에러:', error);
            setCompletedIds(completedIds); // 에러 시 롤백
        }
    };

    // 리셋버튼
    const handleRest = async () => {
        if (!uid || !pattern?.id) return;
        setCompletedIds([]);
        try {
            const docRef = doc(db, 'users', uid, 'GridPatterns', pattern.id);

            await updateDoc(docRef, {
                completedIds: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-5 text-center text-gray-500">도안을 로드 중입니다...</div>;
    if (!pattern) return <div className="p-5 text-center text-gray-500">도안을 찾을 수 없습니다.</div>;

    return (
        <section className="Content">
            {/* 상단 카드 */}
            <div className="relative mx-auto rounded-2xl border border-[#8FD3C3]/30 bg-gradient-to-br from-[var(--color01)] to-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{pattern.title}</h2>
            </div>

            {/* 작업 리스트 (격자 보드) */}
            <div className="mt-6 space-y-3 min-h-147">
                <div className="overflow-x-auto p-2 select-none">
                    <div className="">
                        {pattern.items.map((row, index) => {
                            const actualRowIdx = pattern.items.length - 1 - index;
                            const isDone = completedIds.includes(String(actualRowIdx));

                            return (
                                <div
                                    key={actualRowIdx}
                                    role="button"
                                    onClick={() => handleToggleComplete(String(actualRowIdx))}
                                    style={{
                                        gridTemplateColumns: `repeat(${pattern.gridWidth}, 30px)`,
                                    }}
                                    className={`relative grid w-fit mx-auto cursor-pointer transition-all duration-200 group ${isDone ? 'grayscale opacity-80' : 'hover:bg-emerald-50/30'}`}
                                >
                                    {row.map((cell) => (
                                        <div key={cell.id} style={{ backgroundColor: isDone ? '#e5e7eb' : cell.color }} className={`flex items-center justify-center w-[30px] h-[30px] border border-[#eee] transition-colors group-hover:border-emerald-200/50`}>
                                            {cell.symbol && <img src={`/images/stitch/${cell.symbol}.png`} className={`w-[85%] h-[85%] object-contain pointer-events-none drop-shadow-sm transition-opacity ${isDone ? 'opacity-20' : ''}`} alt={cell.symbol} />}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Button onClick={handleRest}>단수체크 리셋</Button>
            </div>

            {/* 하단 제어 버튼 */}
            <div className="flex items-center justify-end gap-3 mt-5">
                <Link className="flex items-center h-10 px-4 py-2 rounded-lg bg-[#8FD3C3] text-white shadow-md hover:bg-[#7fcbbb] active:scale-[0.97] text-sm font-medium transition" href={`/gridPatterns/${pattern.id}/edit`}>
                    수정
                </Link>
                <Button variant="close">삭제</Button>
            </div>
        </section>
    );
}
