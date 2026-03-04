/**
 * @file message.go
 * @description 訊息模型 / Message Model
 * @description_en Defines message data structures and types
 * @description_zh 定義訊息資料結構與類型
 */

package model

import "time"

// ========================================
// 訊息類型常數 / Message Type Constants
// ========================================

const (
	MessageTypeText  = "TEXT"
	MessageTypeImage = "IMAGE"
	MessageTypeFile  = "FILE"
)

// ========================================
// 訊息模型 / Message Model
// ========================================

type Message struct {
	ID             string    `json:"id"`
	ConversationID string    `json:"conversationId"`
	SenderID       string    `json:"senderId"`
	SenderName     string    `json:"senderName,omitempty"`
	Content        string    `json:"content"`
	MessageType    string    `json:"messageType"` // TEXT, IMAGE, FILE
	FileURL        *string   `json:"fileUrl,omitempty"`
	FileName       *string   `json:"fileName,omitempty"`
	CreatedAt      time.Time `json:"createdAt"`
}

// ========================================
// 傳送訊息請求 / Send Message Request
// ========================================

type SendMessageRequest struct {
	Content     string  `json:"content"`
	MessageType string  `json:"messageType"`
	FileURL     *string `json:"fileUrl,omitempty"`
	FileName    *string `json:"fileName,omitempty"`
}

// ========================================
// WebSocket 訊息封包 / WebSocket Message Payload
// ========================================

type WSMessage struct {
	Type    string      `json:"type"` // "new_message", "read_receipt", "typing"
	Payload interface{} `json:"payload"`
}
