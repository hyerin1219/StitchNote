'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { db } from '@/lib/firebase';
import { IPatternGridItem } from '@/types';

import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';

import WriteGridPattern from './writeGridPattern';

interface IWriteProps {
    mode: 'submit' | 'edit';
    id?: string;
}

export default function PatternsWriteGird({ mode, id }: IWriteProps) {
    const { uid } = useAuth();
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [items, setItems] = useState<IPatternGridItem[][]>([[]]);
    const [title, setTitle] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!uid) return;

        if (mode === 'edit' && id) {
            const fetchData = async () => {
                const docRef = doc(db, 'users', uid, 'GridPatterns', id);
                const snap = await getDoc(docRef);

                if (snap.exists()) {
                    const data = snap.data();

                    setTitle(data.title);
                    setItems(data.items);
                }
            };

            fetchData();
        }
    }, [mode, id]);

    const handleSetItems = useCallback((newItems: IPatternGridItem[][]) => {
        setItems(newItems);
    }, []);

    // 등록 하기
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uid) return;

        try {
            // 수정
            if (mode === 'edit' && id) {
                const docRef = doc(db, 'users', uid, 'GridPatterns', id);

                await updateDoc(docRef, {
                    title,
                    items,
                });

                router.push(`/gridPatterns/${id}`);
            } else {
                // 등록
                if (!title) {
                    triggerAlert('제목을 입력해 주세요!');
                    return;
                }
                //  2차원 배열 items을 1차원
                const flattenedItems = items.flat();
                //  items의 가로 길이 저장
                const gridWidth = items[0].length;

                const patternRef = collection(db, 'users', uid, 'GridPatterns');

                const docRef = await addDoc(patternRef, {
                    author: uid,
                    title,
                    items: flattenedItems,
                    gridWidth: gridWidth,
                    createdAt: serverTimestamp(),
                });

                router.push(`/gridPatterns/${docRef.id}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="Content">
            <h2 className="Title  mb-8">코바늘 도안 작성하기</h2>

            <form onSubmit={handleSubmit}>
                <div className="text-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <label>제목</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="flex-1 py-1 px-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8FD3C3]/40" placeholder="제목을 입력하세요." />
                    </div>
                    {/* 도안 */}
                    <div className="">
                        <p className="mb-2">도안</p>

                        <WriteGridPattern items={items} setItems={handleSetItems} />
                    </div>

                    {/* 버튼 */}
                    <Button type="submit">{mode == 'edit' ? '수정' : '등록'}</Button>
                </div>
            </form>

            {showAlert && <Alert alertValue={alertValue} />}
        </section>
    );
}
