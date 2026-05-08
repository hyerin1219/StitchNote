'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { useCrochetCircleDetail } from '@/hooks/useCrochetCircle';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useChatMessages } from '@/hooks/useChatMessages';

export default function OnlineCrochetCircleDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { uid } = useAuth();
    const { crochetCircle, loading } = useCrochetCircleDetail(id);
    const currentUser = useCurrentUser();
    const [input, setInput] = useState('');

    const messages = useChatMessages(id);
    const scrollRef = useRef<HTMLDivElement>(null); // 스크롤 제어용

    // 메시지가 추가될 때마다 하단으로 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || !currentUser) return;

        await fetch('/api/chat/send', {
            method: 'POST',
            body: JSON.stringify({
                text: input,
                roomId: crochetCircle?.id,
                sender: {
                    uid: currentUser.uid,
                    nickName: currentUser.nickName,
                    character: currentUser.character,
                },
            }),
        });

        setInput('');
    };

    if (!crochetCircle || !currentUser) return null;

    return (
        <section className="Content ">
            <h2 className="Title">{crochetCircle.title}</h2>
            {/* 우리방 정보 */}
            <div className="relative group inline-block">
                {/* 트리거 */}
                <button className="px-3 py-1 text-sm bg-[var(--color04)] text-white rounded-full shadow hover:scale-105 transition">우리방 정보</button>

                {/* 툴팁 카드 */}
                <div className="absolute left-0 top-10  opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-2">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 min-w-[180px] text-sm text-gray-700 backdrop-blur-md">
                        <p className="font-semibold  mb-2">📌 우리방 정보</p>

                        <div className="flex flex-col gap-1">
                            <span>개설일: {crochetCircle.createdAt}</span>
                            <span>인원: {crochetCircle.memberCount}명</span>
                            <span>방장: {crochetCircle.roomManager.nickName}</span>
                            <span>
                                구성원:{' '}
                                {crochetCircle.member.map((el, index) => (
                                    <span key={el.uid || index}>
                                        {el.nickName}
                                        {index < crochetCircle.member.length - 1 && ', '}
                                    </span>
                                ))}
                            </span>
                        </div>

                        {/* 화살표 */}
                        <div className="absolute -top-[7px] left-4  w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
                    </div>
                </div>
            </div>

            <article className="relative w-full">
                <img className="absolute left-1/2 top-[-50px] -translate-x-1/2 w-50 " src="/images/img_lamp.png" alt="조명" />

                {/* 채팅 내역 */}
                <div className="relative w-full h-130 border border-3 border-[var(--color04)] rounded-xl overflow-hidden mt-5 p-3 ">
                    <div ref={scrollRef} className="relative flex flex-col gap-4 w-full h-full p-2 overflow-y-auto  scroll-smooth chat-scroll-custom  z-1">
                        {messages.map((el, index) => {
                            const isMe = el.sender?.uid === uid;

                            return (
                                <div key={el.id || index} className={`flex  ${isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                                    {!isMe && (
                                        <div className="text-center mb-1">
                                            <img src={`/images/char/char_${el.sender?.character}.png`} className="w-8 h-8 object-contain" alt="profile" />
                                            <span className="text-sm">{el.sender?.nickName}</span>
                                        </div>
                                    )}

                                    <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* 말풍선 */}
                                        <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-[#B9D7EA] text-gray-800 rounded-br-none' : 'bg-[#B3D4A5] text-gray-800 rounded-bl-none'}`}>{el.text}</div>

                                        {/* 시간 표시 */}
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap mb-1">{el.createdAt?.toDate ? el.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <img className="absolute left-0 bottom-0 w-full pointer-events-none " src="/images/img_desk3.png" alt="책상" />
                </div>

                {/* 채팅 입력 영역 영역 ... */}
                <div className="mt-5">
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-2 border-[var(--color04)] rounded-full px-4 py-2 shadow-lg">
                        {/* 캐릭터 */}
                        <div className="text-center">
                            <img src={`/images/char/char_${currentUser.character}.png`} alt="character" className="w-11 h-11 h-full object-contain" />
                            <p>{currentUser.nickName}</p>
                        </div>

                        {/* 입력창 */}
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                            className="flex-1 bg-transparent outline-none px-2 "
                        />

                        {/* 전송 버튼 */}
                        <button onClick={sendMessage} disabled={!input.trim()} className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color04)] text-white  hover:scale-110 active:scale-95 transition">
                            ➤
                        </button>
                    </div>
                </div>
            </article>
        </section>
    );
}
