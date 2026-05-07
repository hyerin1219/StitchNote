'use client';

import { Dispatch, RefObject, SetStateAction, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, arrayUnion, collection, doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { ICrochetCircle, ICrochetCircleItem, IUserInfo } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlert } from '@/hooks/useAlert';
import Alert from '@/components/ui/alert';

interface IProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    dialogRef: RefObject<HTMLDialogElement | null>;
    currentUser: IUserInfo | undefined;
    mode: 'create' | 'join';
    data: ICrochetCircle | undefined;
    joinedCircles: ICrochetCircle[];
}
export default function CircleModal({ isOpen, setIsOpen, dialogRef, currentUser, mode, data, joinedCircles }: IProps) {
    const router = useRouter();
    const [password, setPassWord] = useState('');
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [room, setRoom] = useState({
        title: '',
        passwords: '',
    });

    const handleChange = (key: keyof ICrochetCircleItem, value: string) => {
        setRoom((prev) => ({ ...prev, [key]: value }));
    };

    const handleJoinCircle = async () => {
        if (!data || !currentUser) return;

        if (password !== data?.passwords) {
            triggerAlert('비밀번호가 일치하지 않습니다.');
            setPassWord('');
            return;
        }

        try {
            const docRef = doc(db, 'CrochetCircles', data.id);

            await updateDoc(docRef, {
                member: arrayUnion({
                    id: currentUser.id,
                    uid: currentUser.uid,
                    nickName: currentUser.nickName,
                    createdAt: currentUser.createdAt,
                    character: currentUser.character,
                }),

                memberCount: increment(1),
            });

            setIsOpen(false);
            router.push(`/onlineCrochetCircle/${data.id}`);
        } catch (error) {
            console.error('멤버 참여 업데이트 실패:', error);
            // triggerAlert('방 입장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 방 만들기 로직
    const handleCreate = async () => {
        if (!currentUser) return;
        if (!room.title || !room.passwords) {
            triggerAlert('모든 칸을 입력해주세요.');
            return;
        }

        try {
            const crochetCircle = collection(db, 'CrochetCircles');
            const docRef = await addDoc(crochetCircle, {
                roomManager: currentUser,
                ...room,
                member: [currentUser],
                memberCount: 1,
                createdAt: new Date().toLocaleDateString(),
            });

            router.push(`/onlineCrochetCircle/${docRef.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <AnimatePresence>
                {isOpen && (
                    <motion.dialog ref={dialogRef} className="fixed inset-0 m-auto rounded-2xl shadow-2xl p-3 backdrop:bg-black/60 ">
                        <div className="w-[90vw] max-w-[400px] bg-white ">
                            <div className="flex justify-between items-center p-5 ">
                                <h3 className="text-lg ">{mode === 'create' ? '새 뜨개방 만들기' : '뜨개방 함께하기'}</h3>
                                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                                    닫기
                                </button>
                            </div>

                            <form
                                className="p-6 space-y-6"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (mode === 'create') handleCreate();
                                    else handleJoinCircle();
                                }}
                            >
                                {mode === 'create' ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2">
                                            <label>뜨개방 이름</label>
                                            <Input value={room.title} onChange={(el) => handleChange('title', el.target.value)} variant="full" type="text" placeholder="뜨개방 이름을 입력해 주세요." />
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <label>비밀번호</label>
                                            <Input value={room.passwords} onChange={(el) => handleChange('passwords', el.target.value)} variant="full" type="password" placeholder="비밀번호를 입력해 주세요." />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="text-center mb-5 text-2xl">{data?.title}</h4>
                                        <div className="flex items-center justify-center gap-2">
                                            <label>비밀번호</label>
                                            <Input value={password} onChange={(event) => setPassWord(event?.target.value)} variant="full" type="password" placeholder="뜨개방 비밀번호를 입력해주세요." />
                                        </div>
                                    </>
                                )}

                                <Button type="submit" className="block ml-auto">
                                    {mode === 'create' ? '방 만들기' : '방 함께하기'}
                                </Button>
                            </form>
                        </div>
                    </motion.dialog>
                )}
            </AnimatePresence>

            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
