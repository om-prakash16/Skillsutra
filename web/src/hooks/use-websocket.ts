import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { API_BASE_URL } from '@/lib/api/api-client';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected';

export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: string;
}

export function useWebSocket(path: string = '/chat/ws') {
    const { token } = useAuth();
    const [status, setStatus] = useState<WebSocketStatus>('disconnected');
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let isMounted = true;
        let intentionalClose = false;

        const connect = () => {
            if (!token || !isMounted) return;
            
            const wsProtocol = window.location.protocol === 'https:' || API_BASE_URL.startsWith('https') ? 'wss:' : 'ws:';
            const wsHost = API_BASE_URL.replace(/^https?:\/\//, '');
            const wsUrl = `${wsProtocol}//${wsHost}${path}?token=${token}`;

            try {
                setStatus('connecting');
                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    if (!isMounted) {
                        ws.close();
                        return;
                    }
                    setStatus('connected');
                    console.log(`[WebSocket] Connected to ${path}`);
                };

                ws.onmessage = (event) => {
                    if (!isMounted) return;
                    try {
                        const data = JSON.parse(event.data);
                        setLastMessage({
                            type: data.type || 'message',
                            payload: data.payload || data,
                            timestamp: new Date().toISOString()
                        });
                    } catch (e) {
                        console.error('[WebSocket] Failed to parse message', e);
                    }
                };

                ws.onclose = () => {
                    if (!isMounted) return;
                    setStatus('disconnected');
                    console.log(`[WebSocket] Disconnected from ${path}`);
                    
                    if (!intentionalClose) {
                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (isMounted) connect();
                        }, 3000);
                    }
                };

                ws.onerror = (err) => {
                    // Suppress strict-mode errors where close is called during connecting
                    if (!intentionalClose) {
                        console.error('[WebSocket] Error', err);
                    }
                };

                wsRef.current = ws;
            } catch (error) {
                if (!intentionalClose) {
                    console.error('[WebSocket] Connection failed', error);
                }
                if (isMounted) setStatus('disconnected');
            }
        };

        connect();
        
        return () => {
            isMounted = false;
            intentionalClose = true;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [token, path]);

    const sendMessage = useCallback((type: string, payload: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, payload }));
        } else {
            console.warn('[WebSocket] Cannot send message, not connected');
        }
    }, []);

    return {
        status,
        lastMessage,
        sendMessage,
        isConnected: status === 'connected'
    };
}
