const http = require('http');
async function run() {
  const loginRes = await fetch("http://54.255.186.244:8081/api/v1/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "ERP@123456" })
  });
  const { token } = await loginRes.json();
  const createRes = await fetch("http://54.255.186.244:8081/api/v1/accounts", {
    method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ name: "test2", username: "test2", employeeId: "", email: "", githubUsername: "", role: "CLIENT" })
  });
  const text = await createRes.text();
  console.log("RESPONSE:", createRes.status, text);
}
run();
