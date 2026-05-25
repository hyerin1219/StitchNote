'use client';

import { useState } from 'react';
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { CHARACTER } from '@/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Alert from '@/components/ui/alert';
import { useUserStore } from '@/store/useUserStore';

export default function DashBoard() {
    const { uid } = useAuth();
    const [selectedChar, setSelectedChar] = useState<string>(CHARACTER[0]?.value);
    const [nickName, setNickName] = useState('');
    const { showAlert, alertValue, triggerAlert } = useAlert();

    // 캐릭터 생성 로직
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uid) {
            triggerAlert('로그인이 필요합니다.');
            return;
        }

        if (!nickName) {
            triggerAlert('모든 칸을 입력해주세요.');
            return;
        }

        try {
            const userDocRef = doc(db, 'users', uid);

            const userData = {
                uid,
                nickName,
                character: selectedChar,
                createdAt: new Date().toLocaleDateString(),
            };

            await setDoc(userDocRef, userData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="Content">
            <header className="mb-12 text-center">
                <h2 className="Title">캐릭터 설정하기</h2>
                <p className="text-gray-500 text-lg">나만의 개성 있는 캐릭터와 닉네임을 정해보세요.</p>
            </header>

            <div className="flex flex-col lg:flex-row items-start justify-center gap-12 mb-16">
                {/* 캐릭터 선택 영역 */}
                <div className="w-full lg:w-2/3">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5">
                        {CHARACTER.map((el) => {
                            const isSelected = selectedChar === el.value;

                            return (
                                <div
                                    role="button"
                                    key={el.value}
                                    onClick={() => setSelectedChar(el.value)}
                                    className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 cursor-pointer
                                    ${isSelected ? 'bg-white shadow-xl ring-2 ring-[var(--color04)] scale-105 z-10' : 'bg-gray-50 hover:bg-white hover:shadow-md grayscale hover:grayscale-0'}`}
                                >
                                    <img className="w-full aspect-square object-contain mb-3 drop-shadow-sm" src={`/images/char/char_${el.value}.png`} alt={el.label} />
                                    <span className={`text-sm font-medium ${isSelected ? 'text-[var(--color04)]' : 'text-gray-400'}`}>{el.label}</span>

                                    {/* 체크 배지 */}
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 bg-[var(--color04)] text-white rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 닉네임 입력부 */}
                    <div className="flex items-center justify-center gap-2 mt-10 ">
                        <label className="font-semibold text-gray-700 shrink-0">닉네임</label>
                        <Input value={nickName} onChange={(e) => setNickName(e.target.value)} type="text" placeholder="닉네임을 설정하세요." className="w-80" />
                    </div>
                </div>

                {/* 프리뷰 */}
                <div className="w-full lg:w-80  ">
                    <div className="relative overflow-hidden rounded-4xl bg-[var(--color04)] p-8 pt-16 shadow-lg text-center border-8 border-white/20">
                        <img className="w-45 h-45 mx-auto object-contain  " src={`/images/char/char_${selectedChar}.png`} alt="Preview" />

                        <p className="h-12 flex items-center justify-center text-2xl text-white tracking-wide mt-8">{nickName || '닉네임'}</p>
                    </div>

                    <Button onClick={handleCreateUser} className="block mx-auto mt-10">
                        이 캐릭터로 시작하기
                    </Button>
                </div>
            </div>

            {showAlert && <Alert alertValue={alertValue} />}
        </section>
    );
}
