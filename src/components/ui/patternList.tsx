'use client';

import Link from 'next/link';

import { IPattern, IImagePattern, IGirdPattern } from '@/types';

type IProps = { type: 'written'; data: IPattern[] } | { type: 'image'; data: IImagePattern[] } | { type: 'grid'; data: IGirdPattern[] };

export default function PatternCard({ data, type }: IProps) {
    const pathMap = {
        written: 'patterns',
        image: 'imagePatterns',
        grid: 'gridPatterns',
    };
    return (
        <div className="space-y-3 overflow-y-auto p-2">
            {data.map((el) => (
                <Link key={el.id} href={`/${pathMap[type]}/${el.id}`} className="w-full group flex flex-col items-center justify-between gap-3 rounded-xl border  bg-white p-4 transition border-[var(--color04)] hover:shadow-md md:flex-row">
                    {/* 왼쪽 */}
                    <span className="text-base font-semibold text-gray-900 transition group-hover:text-[var(--color04)]">{el.title}</span>

                    {/* 오른쪽 */}
                    <span className="flex flex-col shrink-0 text-xs text-gray-400">{new Date(el.createdAt).toLocaleDateString()}</span>
                </Link>
            ))}
        </div>
    );
}
