#!/bin/bash
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"admin", "password":"ERP@123456"}' http://localhost:8081/api/v1/auth/login | grep -o '\"token\":\"[^\"]*\"' | cut -d\" -f4)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"test2","username":"test2","employeeId":"","email":"","githubUsername":"","role":"CLIENT"}' http://localhost:8081/api/v1/accounts
