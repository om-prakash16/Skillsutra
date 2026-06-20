def test_get_my_portfolio(client):
    response = client.get("/api/v1/portfolio/me")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "github_username" in data["data"]
    assert "engineering_maturity_score" in data["data"]

def test_trigger_github_sync(client):
    response = client.post("/api/v1/portfolio/sync/github")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "successfully" in data["message"]
