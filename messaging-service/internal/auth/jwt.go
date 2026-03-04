/**
 * @file jwt.go
 * @description JWT 認證中介層 / JWT Auth Middleware
 * @description_en Verifies JWT tokens by calling Java backend /auth/me
 * @description_zh 透過呼叫 Java 後端 /auth/me 來驗證 JWT Token
 */

package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

// ========================================
// 使用者資訊 / User Info
// ========================================

type UserInfo struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

type contextKey string

const UserContextKey contextKey = "user"

// ========================================
// 從 Token 取得使用者 / Get User from Token
// ========================================

func GetUserFromToken(token string) (*UserInfo, error) {
	backendURL := os.Getenv("JAVA_BACKEND_URL")
	if backendURL == "" {
		backendURL = "http://backend:8081"
	}

	req, err := http.NewRequest("GET", backendURL+"/api/v1/auth/me", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call auth service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("authentication failed (%d): %s", resp.StatusCode, string(body))
	}

	var user UserInfo
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, fmt.Errorf("failed to decode user info: %w", err)
	}

	return &user, nil
}

// ========================================
// HTTP 中介層 / HTTP Middleware
// ========================================

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, `{"error":"Missing or invalid Authorization header"}`, http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		user, err := GetUserFromToken(token)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ========================================
// Context 工具 / Context Helpers
// ========================================

func GetUserFromContext(ctx context.Context) *UserInfo {
	user, ok := ctx.Value(UserContextKey).(*UserInfo)
	if !ok {
		return nil
	}
	return user
}

// ========================================
// 從查詢參數取得 Token / Get Token from Query Params (for WebSocket)
// ========================================

func ExtractTokenFromQuery(r *http.Request) string {
	return r.URL.Query().Get("token")
}
