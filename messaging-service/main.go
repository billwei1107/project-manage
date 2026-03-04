/**
 * @file main.go
 * @description Go 即時通訊服務入口 / Go Messaging Service Entry Point
 * @description_en Initializes DB, WebSocket Hub, HTTP routes, and starts server
 * @description_zh 初始化資料庫、WebSocket Hub、HTTP 路由並啟動伺服器
 */

package main

import (
	"log"
	"messaging-service/internal/auth"
	"messaging-service/internal/db"
	"messaging-service/internal/handler"
	"messaging-service/internal/ws"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

// ========================================
// WebSocket Upgrader / WebSocket 升級器
// ========================================

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 允許所有來源 / Allow all origins (production should restrict)
	},
}

func main() {
	log.Println("🚀 Starting Messaging Service...")

	// ========================================
	// 初始化資料庫 / Initialize Database
	// ========================================
	db.InitDB()

	// ========================================
	// 初始化 WebSocket Hub / Initialize WebSocket Hub
	// ========================================
	hub := ws.NewHub()
	ws.GlobalHub = hub
	go hub.Run()

	// ========================================
	// 路由設定 / Route Setup
	// ========================================
	mux := http.NewServeMux()

	// 健康檢查 / Health Check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"messaging"}`))
	})

	// WebSocket 端點 / WebSocket Endpoint
	mux.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		token := auth.ExtractTokenFromQuery(r)
		if token == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		user, err := auth.GetUserFromToken(token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("WebSocket upgrade failed: %v", err)
			return
		}

		client := &ws.Client{
			Hub:    hub,
			Conn:   conn,
			Send:   make(chan []byte, 256),
			UserID: user.ID,
		}
		hub.Register(client)

		go client.WritePump()
		go client.ReadPump()
	})

	// REST API (需認證) / REST API (authenticated)
	apiMux := http.NewServeMux()

	// 對話 / Conversations
	apiMux.HandleFunc("/conversations", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handler.GetConversations(w, r)
		case http.MethodPost:
			handler.CreateConversation(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// 訊息 / Messages (路徑: /conversations/{id}/messages)
	apiMux.HandleFunc("/conversations/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		switch {
		case containsSuffix(path, "/messages"):
			switch r.Method {
			case http.MethodGet:
				handler.GetMessages(w, r)
			case http.MethodPost:
				handler.SendMessage(w, r)
			default:
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
		case containsSuffix(path, "/read"):
			if r.Method == http.MethodPost {
				handler.MarkAsRead(w, r)
			}
		default:
			http.Error(w, "Not found", http.StatusNotFound)
		}
	})

	// 上傳 / Upload
	apiMux.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handler.UploadFile(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// 取得使用者列表 / Get Users
	apiMux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handler.GetUsers(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// 未讀數 / Unread Count
	apiMux.HandleFunc("/unread-count", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handler.GetUnreadCount(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// 靜態檔案服務 (上傳的檔案) / Serve uploaded files
	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads"
	}
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadDir))))

	// 掛載認證中介層 / Mount auth middleware
	mux.Handle("/", auth.AuthMiddleware(apiMux))

	// ========================================
	// CORS 中介層 / CORS Middleware
	// ========================================
	corsHandler := corsMiddleware(mux)

	// ========================================
	// 啟動伺服器 / Start Server
	// ========================================
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("✅ Messaging service listening on :%s", port)
	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatal(err)
	}
}

// ========================================
// 工具函式 / Utility
// ========================================

func containsSuffix(path, suffix string) bool {
	return len(path) >= len(suffix) && path[len(path)-len(suffix):] == suffix
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
