import urllib.request
import json
import ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url_login = 'http://localhost:8081/api/v1/auth/login'
data_login = json.dumps({"username":"admin", "password":"ERP@123456"}).encode('utf-8')
req_login = urllib.request.Request(url_login, data=data_login, headers={'Content-Type': 'application/json'})

with urllib.request.urlopen(req_login, context=ctx) as response:
    res = json.loads(response.read().decode('utf-8'))
    token = res['token']

url_create = 'http://localhost:8081/api/v1/accounts'
data_create = json.dumps({"name":"test2", "username":"test2", "employeeId":"", "email":"", "githubUsername":"", "role":"CLIENT"}).encode('utf-8')
req_create = urllib.request.Request(url_create, data=data_create, headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token})

try:
    with urllib.request.urlopen(req_create, context=ctx) as response2:
        print("SUCCESS:", response2.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("ERROR HTTPErr:", e.code, e.reason, e.read().decode('utf-8'))
