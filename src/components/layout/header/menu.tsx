import Link from 'next/link';

type IProps = {
    open: boolean;
    onClose: () => void;
};

export default function Menu({ open, onClose }: IProps) {
    const menus = [
        {
            label: '메인',
            href: '/',
        },
        {
            label: '서술 도안 작성하기',
            href: '/patterns/write',
            // children: [
            //     {
            //         label: '서술 도안 작성하기',
            //         href: '/patterns/write',
            //     },

            //     {
            //         label: '기호 도안 작성하기',
            //         href: '/imagePatterns/write',
            //     },
            // ],
        },

        {
            label: '기호 도안 작성하기',
            href: '/imagePatterns/write',
        },
        {
            label: '배색 도안 작성하기',
            href: '/gridPatterns/write',
        },
        {
            label: '방구석 뜨개방',
            href: '/onlineCrochetCircle/create',
        },
    ];
    return (
        <section className="">
            {/* 배경 오버레이 */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-[90]
                ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            />

            {/* 사이드 메뉴 */}
            <nav className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-[100] ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4">
                    <button onClick={onClose} className="relative block w-6 h-6 group ml-auto" aria-label="메뉴 닫기">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 rounded bg-black rotate-45 group-hover:rotate-0 transition-rotate duration-300" />
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 rounded bg-black -rotate-45 group-hover:rotate-0 transition-rotate duration-300" />
                    </button>

                    <ul className="mt-4 space-y-2 w-full">
                        {menus.map((menu) => (
                            <li key={menu.href}>
                                <Link onClick={onClose} href={menu.href} className="block w-full text-xl hover:bg-[var(--color02)] p-2">
                                    {menu.label}
                                </Link>

                                {/* {menu.children && (
                                    <ul className="ml-4 mt-2 space-y-1">
                                        {menu.children.map((sub) => (
                                            <li key={sub.href}>
                                                <Link onClick={onClose} href={sub.href} className="block text-lg p-2 hover:bg-[#e8f3f0]">
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )} */}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </section>
    );
}
