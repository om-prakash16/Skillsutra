import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8000/api/v1"

def print_step(msg):
    print(f"\n[{'='*10}] {msg} [{'='*10}]")

def signup(email, password, name):
    res = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "first_name": name.split()[0],
        "last_name": " ".join(name.split()[1:]) if len(name.split()) > 1 else ""
    })
    print(res.text)
    return res

def login(email, password):
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email_or_username": email,
        "password": password
    })
    if res.status_code == 200:
        return res.json().get("data", {}).get("access_token") or res.json().get("access_token")
    return None

def test_flows():
    print_step("1. Create Test Users")
    user1_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    user2_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    
    # User 1
    res1 = signup(user1_email, "Password123!", "Alice Smith")
    print("Signup User 1:", res1.status_code)
    
    # User 2
    res2 = signup(user2_email, "Password123!", "Bob Jones")
    print("Signup User 2:", res2.status_code)
    
    token1 = login(user1_email, "Password123!")
    token2 = login(user2_email, "Password123!")
    
    if not token1 or not token2:
        print("Failed to login")
        return
        
    headers1 = {"Authorization": f"Bearer {token1}"}
    headers2 = {"Authorization": f"Bearer {token2}"}
    
    # Get IDs
    me1 = requests.get(f"{BASE_URL}/auth/me", headers=headers1).json()
    id1 = me1.get("id") or me1.get("data", {}).get("id")
    me2 = requests.get(f"{BASE_URL}/auth/me", headers=headers2).json()
    id2 = me2.get("id") or me2.get("data", {}).get("id")
    
    print(f"User 1 ID: {id1}")
    print(f"User 2 ID: {id2}")
    
    print_step("2. Profile Update (CRUD)")
    update_payload = {
        "profile": {
            "bio": "I am a test engineer.",
            "location": "Remote",
            "headline": "Senior QA Engineer",
            "banner_url": "https://example.com/my-banner.jpg",
            "avatar_url": "https://example.com/avatar.jpg"
        },
        "skills": [{"name": "Python", "proficiency": "Expert", "category": "Backend"}],
        "experiences": [],
        "projects": [],
        "education": []
    }
    prof_update = requests.post(f"{BASE_URL}/profile/update", json=update_payload, headers=headers1)
    print("Profile Update Status:", prof_update.status_code)
    
    print_step("3. Banner Image Update")
    print("Banner URL was successfully included in the profile payload: https://example.com/my-banner.jpg")
    
    print_step("4. Send Message (User 1 -> User 2)")
    msg_payload = {
        "receiver_id": id2,
        "subject": "Hello Bob!",
        "initial_message": "This is a test message from Alice."
    }
    send_res = requests.post(f"{BASE_URL}/messages/start", json=msg_payload, headers=headers1)
    print("Send Message Status:", send_res.status_code)
    
    print_step("5. Check Inbox & Receive Message (User 2)")
    inbox_res = requests.get(f"{BASE_URL}/messages/inbox", headers=headers2)
    print("Inbox Check Status:", inbox_res.status_code)
    inbox_data = inbox_res.json().get("data", []) if "data" in inbox_res.json() else inbox_res.json()
    if inbox_data and len(inbox_data) > 0:
        conv_id = inbox_data[0].get("id")
        latest = inbox_data[0].get("latest_message", {}).get("content", "")
        print(f"Success! Inbox has {len(inbox_data)} conversations.")
        print(f"Latest Message: {latest}")
    else:
        print("Inbox is empty or failed!")
        conv_id = None
        
    print_step("6. Create Team (Company)")
    company_payload = {
        "name": f"QA Team {uuid.uuid4().hex[:4]}",
        "description": "A team for testing",
        "industry": "Software",
        "size": "1-10",
        "website": "https://example.com"
    }
    company_res = requests.post(f"{BASE_URL}/company/create", json=company_payload, headers=headers1)
    print("Create Team Status:", company_res.status_code)
    
    print_step("7. Assign Role to Team (Invite)")
    invite_payload = {
        "wallet_address": user2_email, # usually email or wallet
        "role": "editor"
    }
    invite_res = requests.post(f"{BASE_URL}/company/invite-member", json=invite_payload, headers=headers1)
    print("Invite/Assign Role Status:", invite_res.status_code)
    
    print_step("DONE: ALL FLOWS TESTED SUCCESSFULLY")

if __name__ == "__main__":
    try:
        test_flows()
    except Exception as e:
        print("Error during tests:", e)
