/**
 * @file conversation.go
 * @description 對話模型 / Conversation Model
 * @description_en Defines conversation and member data structures
 * @description_zh 定義對話與成員資料結構
 */

package model

import "time"

// ========================================
// 對話類型常數 / Conversation Type Constants
// ========================================

const (
	ConversationTypeDirect = "DIRECT" // 一對一私訊 / Direct message
	ConversationTypeGroup  = "GROUP"  // 群組聊天 / Group chat
)

// ========================================
// 對話模型 / Conversation Model
// ========================================

type Conversation struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"` // DIRECT or GROUP
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ========================================
// 對話成員模型 / Conversation Member Model
// ========================================

type ConversationMember struct {
	ConversationID string     `json:"conversationId"`
	UserID         string     `json:"userId"`
	LastReadAt     *time.Time `json:"lastReadAt"`
	JoinedAt       time.Time  `json:"joinedAt"`
}

// ========================================
// 對話列表回傳 / Conversation List Response
// ========================================

type ConversationListItem struct {
	ID            string     `json:"id"`
	Name          string     `json:"name"`
	Type          string     `json:"type"`
	UnreadCount   int        `json:"unreadCount"`
	LastMessage   *string    `json:"lastMessage"`
	LastMessageAt *time.Time `json:"lastMessageAt"`
	LastSenderID  *string    `json:"lastSenderId"`
	Members       []MemberInfo `json:"members"`
}

type MemberInfo struct {
	UserID string `json:"userId"`
	Name   string `json:"name"`
}

// ========================================
// 建立對話請求 / Create Conversation Request
// ========================================

type CreateConversationRequest struct {
	Name      string   `json:"name"`
	Type      string   `json:"type"`
	MemberIDs []string `json:"memberIds"`
}
