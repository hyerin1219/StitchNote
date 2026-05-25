'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';

import { CATEGORIES } from '@/lib';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

import Link from 'next/link';
import { useImagePatternDetail } from '@/hooks/useImagePattern';

export default function ImagePatternsDetail() {
    const params = useParams();
    const id = params?.id as string;

    const { pattern, loading } = useImagePatternDetail(id);

    const [completedIds, setCompletedIds] = useState<string[]>([]);

    const { uid } = useAuth();

    useEffect(() => {
        if (pattern?.completedIds) {
            setCompletedIds(pattern.completedIds);
        }
    }, [pattern]);

    const Items = useMemo(() => {
        if (!pattern?.items) return [];
        return [...pattern.items].reverse();
    }, [pattern?.items]);

    // 단수 체크
    const handleToggleComplete = async (stepId: string) => {
        if (!uid || !pattern?.id) return;

        const isNow = completedIds.includes(stepId);

        const updated = isNow ? completedIds.filter((v) => v !== stepId) : [...completedIds, stepId];

        setCompletedIds(updated);

        try {
            const docRef = doc(db, 'users', uid, 'ImagePatterns', pattern.id);

            await updateDoc(docRef, {
                completedIds: updated,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (!pattern) return null;

    return (
        <section className="Content ">
            {/* 상단 카드 */}
            <div className="relative mx-auto rounded-2xl border border-[#8FD3C3]/30 bg-gradient-to-br  from-[var(--color01)] to-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{pattern.title}</h2>
                <span className="mt-2 inline-block rounded-full bg-[#8FD3C3]/20 px-3 py-1 text-xs font-medium text-[#5FB8A6]">{CATEGORIES.find((el) => el.value === pattern.category)?.label}</span>
                <p className="mt-4 text-lg text-gray-600 whitespace-pre-line leading-relaxed">{pattern.content}</p>
            </div>

            {/* 작업 리스트 */}
            <div className="mt-6 space-y-3 min-h-128 ">
                {Items.map((el, i) => {
                    const isDone = completedIds.includes(String(el.id));

                    return (
                        <div
                            key={el.id}
                            onClick={() => handleToggleComplete(String(el.id))}
                            className={` group cursor-pointer rounded-xl border p-4 transition
                            ${isDone ? 'bg-[#8FD3C3]/20 border-[#8FD3C3]' : 'bg-white border-gray-200 hover:shadow-sm'}  `}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>{el.row}단</p>

                                    <div className="flex items-center gap-1">
                                        {el.symbols?.map((stitch, idx) => (
                                            <img key={idx} className={`w-5 ${isDone ? 'grayscale brightness-75 opacity-30' : ''}`} src={`/images/stitch/${stitch}.png`} alt="" />
                                        ))}
                                    </div>
                                </div>

                                <div
                                    className={`mt-1 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center
                                    ${isDone ? 'bg-[#8FD3C3] border-[#8FD3C3]' : 'border-gray-300 group-hover:border-[#8FD3C3]'}`}
                                >
                                    {isDone && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-end gap-3 mt-5 ">
                <Link className="h-10 px-4 py-2 rounded-lg bg-[#8FD3C3] text-white shadow-md hover:bg-[#7fcbbb] active:scale-[0.97]" href={`/imagePatterns/${pattern.id}/edit`}>
                    수정
                </Link>
                <Button variant="close">삭제</Button>
            </div>
        </section>
    );
}
