import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { IChatMessage } from '@/types';

export function useChatMessages(roomId: string) {
    const [messages, setMessages] = useState<IChatMessage[]>([]);

    useEffect(() => {
        if (!roomId) return;

        const q = query(collection(db, 'CrochetCircles', roomId, 'messages'), orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgData: IChatMessage[] = snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    text: data.text || '',
                    sender: data.sender || null,
                    createdAt: data.createdAt || null,
                };
            });

            setMessages(msgData);
        });

        return () => unsubscribe();
    }, [roomId]);

    return messages;
}
