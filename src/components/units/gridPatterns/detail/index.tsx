'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

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

    // 단수 체크
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
            console.error(error);
        }
    };

    if (!pattern) return null;

    // 1차원 배열을 2차원으로 복원하는 로직 추가

    const items2D = pattern.items && pattern.gridWidth ? Array.from({ length: Math.ceil(pattern.items.length / pattern.gridWidth) }, (_, i) => pattern.items.slice(i * pattern.gridWidth, (i + 1) * pattern.gridWidth)) : [];

    return (
        <section className="Content ">
            {/* 상단 카드 */}
            <div className="relative mx-auto rounded-2xl border border-[#8FD3C3]/30 bg-gradient-to-br  from-[var(--color01)] to-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{pattern.title}</h2>
            </div>

            {/* 작업 리스트 */}
            <div className="mt-6 space-y-3 min-h-147">
                <div className="overflow-x-auto ">
                    <div className="shadow-md bg-white ring-1 ring-gray-200">
                        {items2D.map((row, rIdx) => {
                            const isDone = completedIds.includes(String(rIdx));

                            return (
                                <div
                                    key={rIdx}
                                    role="button"
                                    onClick={() => handleToggleComplete(String(rIdx))}
                                    style={{
                                        gridTemplateColumns: `repeat(${pattern.gridWidth}, 30px)`,
                                    }}
                                    className={`relative grid w-fit mx-auto cursor-pointer transition-all duration-200 group hover:bg-emerald-50/30`}
                                >
                                    {row.map((cell) => (
                                        <div key={cell.id} style={{ backgroundColor: isDone ? '#eee' : cell.color }} className={`flex items-center justify-center w-[30px] h-[30px] border  border-[#ccc]  group-hover:border-emerald-200/50 `}>
                                            {cell.symbol && <img src={`/images/stitch/${cell.symbol}.png`} className={`w-[85%] h-[85%] object-contain pointer-events-none drop-shadow-sm ${isDone ? 'opacity-20' : ''}`} alt={cell.symbol} />}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* 버튼 */}
            <div className="flex items-center justify-end gap-3 mt-5 ">
                <Link className="h-10 px-4 py-2 rounded-lg bg-[#8FD3C3] text-white shadow-md hover:bg-[#7fcbbb] active:scale-[0.97]" href={`/gridPatterns/${pattern.id}/edit`}>
                    수정
                </Link>
                <Button variant="close">삭제</Button>
            </div>
        </section>
    );
}
