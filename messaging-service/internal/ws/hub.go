/**
 * @file hub.go
 * @description WebSocket Hub / WebSocket 連線管理中心
 * @description_en Manages all active WebSocket connections and broadcasts messages
 * @description_zh 管理所有活躍的 WebSocket 連線並廣播訊息
 */

package ws

import (
	"encoding/json"
	"log"
	"messaging-service/internal/model"
	"sync"
)

// ========================================
// Hub 結構 / Hub Structure
// ========================================

type Hub struct {
	// 以 userID 為key，每個用戶可能多個連線 / Map userId -> []*Client
	clients    map[string]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

var GlobalHub *Hub

// ========================================
// 建立 Hub / Create Hub
// ========================================

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[string]map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// ========================================
// 啟動 Hub / Run Hub
// ========================================

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			if h.clients[client.UserID] == nil {
				h.clients[client.UserID] = make(map[*Client]bool)
			}
			h.clients[client.UserID][client] = true
			h.mu.Unlock()
			log.Printf("🟢 User %s connected (total connections: %d)", client.UserID, len(h.clients[client.UserID]))

		case client := <-h.unregister:
			h.mu.Lock()
			if conns, ok := h.clients[client.UserID]; ok {
				delete(conns, client)
				if len(conns) == 0 {
					delete(h.clients, client.UserID)
				}
			}
			close(client.Send)
			h.mu.Unlock()
			log.Printf("🔴 User %s disconnected", client.UserID)
		}
	}
}

// ========================================
// 向指定用戶推送訊息 / Send to Specific User
// ========================================

func (h *Hub) SendToUser(userID string, msg model.WSMessage) {
	data, err := json.Marshal(msg)
	if err != nil {
		log.Printf("Failed to marshal message: %v", err)
		return
	}

	h.mu.RLock()
	defer h.mu.RUnlock()

	if conns, ok := h.clients[userID]; ok {
		for client := range conns {
			select {
			case client.Send <- data:
			default:
				// 緩衝區滿，關閉連線 / Buffer full, close connection
				close(client.Send)
				delete(conns, client)
			}
		}
	}
}

// ========================================
// 向多位用戶推送 / Send to Multiple Users
// ========================================

func (h *Hub) SendToUsers(userIDs []string, msg model.WSMessage) {
	for _, uid := range userIDs {
		h.SendToUser(uid, msg)
	}
}

// ========================================
// 註冊與取消註冊頻道 / Register/Unregister Channels
// ========================================

func (h *Hub) Register(client *Client) {
	h.register <- client
}

func (h *Hub) Unregister(client *Client) {
	h.unregister <- client
}
