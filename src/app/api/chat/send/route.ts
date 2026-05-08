// app/api/chat/send/route.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
    const { text, roomId, sender } = await req.json();

    try {
        // 1. 경로 수정: CrochetCircles -> [roomId] -> messages
        const messageRef = collection(db, 'CrochetCircles', roomId, 'messages');

        const messageData = {
            text,
            sender,

            createdAt: serverTimestamp(),
        };

        // 2. DB 저장
        const docRef = await addDoc(messageRef, messageData);

        // 3. Pusher 전송 (실시간 알림)
        await pusherServer.trigger(`chat-${roomId}`, 'new-message', {
            ...messageData,
            id: docRef.id,
            createdAt: new Date().toISOString(), // 클라이언트 즉시 렌더링용
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: 'Failed to send' }, { status: 500 });
    }
}
