'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { usePatternDetail } from '@/hooks/usePattern';

export default function PatternsDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { uid } = useAuth();
    const { pattern, loading } = usePatternDetail(id);

    const [completedIds, setCompletedIds] = useState<string[]>([]);

    // 도안 데이터가 로드되면 완료된 ID 배열을 상태에 동기화
    useEffect(() => {
        if (pattern?.completedIds) {
            setCompletedIds(pattern.completedIds);
        }
    }, [pattern]);

    //   items 역순 정렬을 useMemo
    const items = useMemo(() => {
        if (!pattern?.items) return [];
        return [...pattern.items].reverse();
    }, [pattern?.items]);

    // 로딩 처리
    if (loading) return <div className="p-5 text-center text-gray-500">도안을 불러오는 중입니다...</div>;
    if (!pattern) return <div className="p-5 text-center text-gray-500">도안을 찾을 수 없습니다.</div>;

    // 단수 완료
    const handleToggleComplete = async (stepId: string) => {
        if (!uid || !pattern.id) return;

        const isNow = completedIds.includes(stepId);
        const updated = isNow ? completedIds.filter((v) => v !== stepId) : [...completedIds, stepId];

        setCompletedIds(updated);

        try {
            const docRef = doc(db, 'users', uid, 'patterns', pattern.id);

            await setDoc(
                docRef,
                {
                    completedIds: updated,
                },
                { merge: true }
            );
        } catch (error) {
            console.error('단수 업데이트 실패:', error);
            setCompletedIds(completedIds);
        }
    };

    return (
        <section className="Content">
            {/* 상단 카드 */}
            <div className="relative mx-auto rounded-2xl  bg-gradient-to-br from-[var(--color01)] to-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{pattern.title}</h2>
                <span className="mt-2 inline-block rounded-full bg-[#8FD3C3]/20 px-3 py-1 text-xs font-medium text-[#5FB8A6]">{CATEGORIES.find((el) => el.value === pattern.category)?.label || '기타'}</span>
                <p className="mt-4 text-lg text-gray-600 whitespace-pre-line leading-relaxed">{pattern.content}</p>
            </div>

            {/* 작업 리스트 */}
            <div className="mt-6 space-y-3 min-h-128">
                {items.map((el) => {
                    const stringId = String(el.id);
                    const isDone = completedIds.includes(stringId);

                    return (
                        <div key={el.id} onClick={() => handleToggleComplete(stringId)} className={`group cursor-pointer rounded-xl border p-4 transition ${isDone ? 'bg-[#8FD3C3]/20 border-[#8FD3C3]' : 'bg-white border-gray-200 hover:shadow-sm'}`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>{el.rows} 단</p>
                                    {!isDone && <p className="mt-1 text-sm text-gray-600">{el.text}</p>}
                                </div>

                                <div className={`mt-1 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${isDone ? 'bg-[#8FD3C3] border-[#8FD3C3]' : 'border-gray-300 group-hover:border-[#8FD3C3]'}`}>{isDone && <div className="h-2.5 w-2.5 rounded-full bg-white" />}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-end gap-3 mt-5">
                <Link className="flex items-center h-10 px-4 py-2 rounded-lg bg-[#8FD3C3] text-white shadow-md hover:bg-[#7fcbbb] active:scale-[0.97] text-sm font-medium transition" href={`/patterns/${pattern.id}/edit`}>
                    수정
                </Link>
                <Button variant="close">삭제</Button>
            </div>
        </section>
    );
}
