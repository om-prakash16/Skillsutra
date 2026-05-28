import urllib.request, json
url = 'http://127.0.0.1:8000/api/v1/auth/login'
data = {'email_or_username': 'testuser@skillsutra.com', 'password': 'Password123!'}
req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as f:
        print(f.read().decode())
except urllib.error.HTTPError as e:
    print(e.code, e.read().decode())
except Exception as e:
    print(e)
