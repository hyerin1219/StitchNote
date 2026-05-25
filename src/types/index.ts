import { Timestamp } from 'firebase/firestore';

// 코바늘 도안 form 타입
export type IFormState = {
    title: string;
    content: string;
    category: string;
};

// ******************************* 서술 도안 type

// 코바늘 도안 타입
export type IPatternItem = {
    id: string;
    rows: string;
    text: string;
};

// 최종 도안 타입
export type IPattern = {
    id: string; // 문서 id
    author: string; // 작가 uid
    title: string;
    content: string;
    category: string;
    createdAt: Timestamp;
    items: IPatternItem[];

    completedIds: string[];
};

// ******************************* 기호 도안 type

export type IPatternImageItem = {
    id: string;
    symbols: string[];
    row: number;
};

export type IImagePattern = {
    id: string; // 문서 id
    author: string; // 작가 uid
    title: string;
    content: string;
    category: string;
    createdAt: Timestamp;
    items: IPatternImageItem[];

    completedIds: string[];
};

// ******************************* 배색 도안 type

export type IPatternGridItem = {
    color: string;
    symbol: string | null;
    id: string;
};

export type IGirdPattern = {
    id: string;
    author: string;
    title: string;
    createdAt: Timestamp;
    gridWidth: number;
    items: IPatternGridItem[];
    // items: IPatternGridItem[][];

    completedIds: string[];
};

export interface IGridPattern2D extends Omit<IGirdPattern, 'items'> {
    items: IPatternGridItem[][];
}

// ******************************* user type
export interface IUserInfo {
    id: string; // 문서 ID
    character: string;
    createdAt: Timestamp;
    nickName: string;
    uid: string;
}
// ******************************* 뜨개방 type

export type ICrochetCircleItem = {
    title: string;
    passwords: string;
};

export type ICrochetCircle = {
    roomManager: IUserInfo;
    createdAt: Timestamp;
    id: string;
    room: ICrochetCircleItem[];
    member: IUserInfo[];
    memberCount: number;
    title: string;
    passwords: string;
};

export interface IChatMessage {
    id: string;
    text: string;
    sender: {
        uid: string;
        nickName: string;
        character: string;
    };
    createdAt: Timestamp;
}
