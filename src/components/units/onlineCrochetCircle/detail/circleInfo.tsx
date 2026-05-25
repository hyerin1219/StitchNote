import { ICrochetCircle, ICrochetCircleItem } from '@/types';

interface ICircleInfoProps {
    crochetCircle: ICrochetCircle;
}

export default function CircleInfo({ crochetCircle }: ICircleInfoProps) {
    if (!crochetCircle) return null;

    return (
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
    );
}
