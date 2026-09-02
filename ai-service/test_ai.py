"""
Unit tests for Land Stack Python FastAPI AI Governance Service
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/ai/health")
    assert response.status_code == 200
    assert response.json()["status"] == "UP"

def test_tax_risk():
    payload = {
        "ulpin": "DEMO-MH-000001",
        "annual_tax": 12000.0,
        "paid_amount": 4000.0,
        "outstanding_amount": 8000.0,
        "days_overdue": 730,
        "missed_payments_count": 2
    }
    response = client.post("/api/ai/tax-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["ulpin"] == "DEMO-MH-000001"
    assert data["riskLevel"] in ["HIGH", "CRITICAL"]
    assert "Generate tax reminder" in data["recommendation"]

def test_dispute_risk():
    payload = {"ulpin": "DEMO-MH-000003"}
    response = client.post("/api/ai/dispute-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["riskScore"] == 78.0
    assert data["riskLevel"] == "HIGH"

def test_boundary_conflict():
    payload = {
        "parcel_a_ulpin": "DEMO-MH-000002",
        "parcel_b_ulpin": "DEMO-MH-000003",
        "overlap_area_sqm": 130.0
    }
    response = client.post("/api/ai/boundary-conflict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["riskLevel"] == "CRITICAL"

def test_parcel_risk_unified():
    payload = {"ulpin": "DEMO-MH-000003"}
    response = client.post("/api/ai/parcel-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["riskScore"] == 82.0
    assert len(data["factors"]) >= 4

def test_land_assistant():
    payload = {
        "ulpin": "DEMO-MH-000003",
        "query": "Why is this parcel marked high risk?"
    }
    response = client.post("/api/ai/assistant", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "HIGH RISK" in data["answer"]
    assert "CS/2024/9912" in data["fact"]
