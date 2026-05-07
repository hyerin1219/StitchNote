import { IUserInfo } from '@/types';

interface IProps {
    currentUser: IUserInfo;
}

export default function Character({ currentUser }: IProps) {
    return (
        <div className="w-full">
            <div className="flex items-center gap-4 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm bg-white hover:shadow-md transition-shadow">
                {/* 캐릭터 */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-50 border-2 border-[var(--color04)] p-1 overflow-hidden">
                    <img src={`/images/char/char_${currentUser.character}.png`} alt="character" className="w-full h-full object-contain transform hover:scale-110 transition-transform" />
                </div>

                {/* 정보 영역 */}
                <div className="flex flex-col min-w-0">
                    <span className="text-lg">{currentUser.nickName}</span>
                    <span className="text-[11px] text-gray-400">Since {currentUser.createdAt}</span>
                </div>
            </div>
        </div>
    );
}
