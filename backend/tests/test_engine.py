"""
Unit and Integration Tests for AI Retail Stock Intelligence Decision Engine
"""

from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_api_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert len(data["active_agents"]) == 10
    assert data["stores_count"] == 10

def test_demo_scenario():
    response = client.get("/api/demo-scenario")
    assert response.status_code == 200
    data = response.json()
    assert "storyline" in data
    storyline = data["storyline"]
    assert "step_1" in storyline
    assert "step_3" in storyline
    rec_option = storyline["step_3"]["evaluation"]["recommended_option"]
    assert rec_option["code"] == "HYBRID"
    assert rec_option["net_recovery"] > 10000.0

def test_stores_and_batches():
    stores_resp = client.get("/api/stores")
    assert stores_resp.status_code == 200
    assert len(stores_resp.json()) == 10

    batches_resp = client.get("/api/batches")
    assert batches_resp.status_code == 200
    assert len(batches_resp.json()) >= 5

def test_conversational_query():
    response = client.post("/api/query-insights", json={"query": "Why did dairy waste rise in Store A?"})
    assert response.status_code == 200
    data = response.json()
    assert "dairy" in data["answer"].lower()
    assert "store a" in data["answer"].lower()

def test_vision_scan():
    response = client.post("/api/vision-check", json={"image_name": "yogurt_seal.jpg", "batch_id": "BATCH_YOG_101"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VERIFIED_VALID"
    assert data["confidence_score"] > 0.95

def test_roi_model():
    response = client.get("/api/roi-model")
    assert response.status_code == 200
    data = response.json()
    assert data["num_stores"] == 10
    assert "base" in data["scenarios"]
