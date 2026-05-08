'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Plus, Users, Calendar, ArrowRight, LayoutGrid } from 'lucide-react';
import CircleModal from './circleModal';
import { useUserStore } from '@/store/useUserStore';
import Character from '@/components/ui/character';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCrochetCircle } from '@/hooks/useCrochetCircle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnlineCrochetCircle() {
    const currentUser = useCurrentUser();
    const { data, loading: circleLoading } = useCrochetCircle();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [modalMode, setModalMode] = useState<'create' | 'join'>('create');
    const [selectedCircle, setSelectedCircle] = useState<any>(null);

    const { fetchUsers, loading: userLoading } = useUserStore();

    const joinedCircles = useMemo(() => {
        if (!data || !Array.isArray(data) || !currentUser?.uid) return [];
        return data.filter((circle) => {
            if (!circle.member || !Array.isArray(circle.member)) return false;
            return circle.member.some((m: any) => String(m.uid).trim() === String(currentUser.uid).trim());
        });
    }, [data, currentUser?.uid]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateModal = () => {
        setModalMode('create');
        setSelectedCircle(null);
        setIsOpen(true);
        dialogRef.current?.showModal();
    };

    const handleJoinModal = (circleData: any) => {
        const isJoined = joinedCircles.some((circle) => circle.id === circleData.id);
        if (isJoined) {
            router.push(`/onlineCrochetCircle/${circleData.id}`);
            return;
        }
        setModalMode('join');
        setSelectedCircle(circleData);
        setIsOpen(true);
        dialogRef.current?.showModal();
    };

    return (
        <section className="Content">
            <h2 className="Title">온라인 뜨개방</h2>
            <div className="flex justify-between items-center ">
                <p className="">참여 중인 유저들과 실시간 뜨개 모임을 즐기세요.</p>

                <Button variant="blue" onClick={handleCreateModal}>
                    <Plus size={18} />
                    뜨개방 만들기
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 mt-10">
                {/* 왼쪽: 방 리스트 영역 */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-6">
                        <LayoutGrid size={18} className="text-gray-400" />
                        <span className="font-bold text-gray-700">전체 뜨개 모임</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{data?.length || 0}</span>
                    </div>

                    {circleLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-full h-28 rounded-2xl bg-gray-50 animate-pulse border" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {data.map((el) => {
                                const isJoined = joinedCircles.some((c) => c.id === el.id);
                                return (
                                    <div
                                        onClick={() => handleJoinModal(el)}
                                        key={el.id}
                                        className={`group relative flex items-center justify-between p-6 bg-white rounded-2xl border-2  transition-all cursor-pointer shadow-lg hover:shadow-none
                                            ${isJoined ? 'border-[var(--color04)] ' : 'border-gray-100 hover:border-[var(--color03)]'}
                                        `}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl ">{el.title}</h3>
                                                {isJoined && <span className="text-sm text-[var(--color04)] bg-[var(--color04)]/10 px-2 py-0.5 rounded border border-[var(--color04)]/20">참여 중</span>}
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-400 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} className="text-[var(--color03)]" />
                                                    <span className="text-gray-600 font-medium">{el.memberCount}명 참여</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{el.createdAt}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-300 group-hover:text-[var(--color04)] transition-colors">
                                            <span className="text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">입장하기</span>
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                );
                            })}

                            {!circleLoading && data.length === 0 && <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 text-sm">개설된 방이 없습니다. 첫 번째 방을 만들어보세요!</div>}
                        </div>
                    )}
                </div>

                {/* 내 정보 및 참여 현황 */}
                <div className="w-full lg:w-80 space-y-8">
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                        <h4 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-widest">My Status</h4>
                        {!userLoading && currentUser ? <Character currentUser={currentUser} /> : <div className="h-48 bg-white rounded-2xl border animate-pulse" />}
                    </div>

                    {/* 참여 중인 방*/}
                    {joinedCircles.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">My Circles</h4>
                            <div className="space-y-2">
                                {joinedCircles.map((el) => (
                                    <Link href={`/onlineCrochetCircle/${el.id}`} key={el.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[var(--color03)] hover:shadow-sm transition-all group">
                                        <span className="text-sm font-bold text-gray-700 truncate mr-2">{el.title}</span>
                                        <ArrowRight size={14} className="text-gray-300 group-hover:text-[var(--color03)]" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CircleModal joinedCircles={joinedCircles} currentUser={currentUser} isOpen={isOpen} setIsOpen={setIsOpen} dialogRef={dialogRef} mode={modalMode} data={selectedCircle} />
        </section>
    );
}
