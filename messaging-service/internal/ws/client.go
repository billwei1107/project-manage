/**
 * @file client.go
 * @description WebSocket Client / WebSocket 客戶端連線
 * @description_en Represents a single WebSocket connection; handles read/write pumps
 * @description_zh 代表一條 WebSocket 連線，處理讀取與寫入循環
 */

package ws

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// ========================================
// 常數定義 / Constants
// ========================================

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 1024 * 64 // 64KB
)

// ========================================
// Client 結構 / Client Structure
// ========================================

type Client struct {
	Hub    *Hub
	Conn   *websocket.Conn
	Send   chan []byte
	UserID string
}

// ========================================
// 讀取循環 / Read Pump
// ========================================

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister(c)
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, _, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}
		// 來自客戶端的訊息由 REST API 處理，這裡僅維持連線
		// Messages from client are handled via REST API; this just keeps connection alive
	}
}

// ========================================
// 寫入循環 / Write Pump
// ========================================

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Hub 關閉了此連線 / Hub closed this connection
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
