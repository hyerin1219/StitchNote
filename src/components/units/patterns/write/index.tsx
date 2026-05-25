'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import WritePattern from './writePattern';
import WriteForm from '../../../ui/writeForm';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { db } from '@/lib/firebase';
import { IPatternItem, IFormState } from '@/types';

import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface IWriteProps {
    mode: 'submit' | 'edit';
    id?: string;
}

export default function PatternsWrite({ mode, id }: IWriteProps) {
    const { uid } = useAuth();
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [items, setItems] = useState<IPatternItem[]>([]);
    const [form, setForm] = useState<IFormState>({
        title: '',
        category: '',
        content: '',
    });

    const router = useRouter();

    useEffect(() => {
        // 로그인 체크: 렌더링 중이 아니라 useEffect 안에서 실행
        if (!uid) return;

        if (mode === 'edit' && id) {
            const fetchData = async () => {
                const docRef = doc(db, 'users', uid, 'Patterns', id);
                const snap = await getDoc(docRef);

                if (snap.exists()) {
                    const data = snap.data();
                    setForm({
                        title: data.title || '',
                        content: data.content || '',
                        category: data.category || '',
                    });
                    setItems(data.items || []);
                }
            };
            fetchData();
        }
    }, [mode, id, uid]); // uid 의존성 추가

    // 등록 수정 하기
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uid) return;

        if (!form.title || !form.category || !form.content) {
            triggerAlert('모든 칸을 입력해주세요.');
            return;
        }

        try {
            // 수정
            if (mode === 'edit' && id) {
                const docRef = doc(db, 'users', uid, 'Patterns', id);

                await updateDoc(docRef, {
                    ...form,
                    items,
                });

                router.push(`/patterns/${id}`);
            } else {
                // 등록
                const patternRef = collection(db, 'users', uid, 'Patterns');

                const docRef = await addDoc(patternRef, {
                    author: uid,
                    ...form,
                    items,
                    createdAt: serverTimestamp(),
                });

                router.push(`/patterns/${docRef.id}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="Content">
            <h2 className="Title  mb-8"> {mode === 'edit' ? '도안 수정하기' : '코바늘 도안 작성하기'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="text-xl space-y-6">
                    <WriteForm form={form} setForm={setForm} />

                    {/* 도안 */}
                    <div className="">
                        <p className="mb-2">도안</p>
                        <WritePattern key="text" items={items} setItems={setItems} />
                    </div>

                    {/* 버튼 */}
                    <Button type="submit">{mode == 'edit' ? '수정' : '등록'}</Button>
                </div>
            </form>

            {showAlert && <Alert alertValue={alertValue} />}
        </section>
    );
}
