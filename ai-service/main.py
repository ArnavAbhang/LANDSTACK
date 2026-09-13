"""
Land Stack AI Governance & Decision-Support Engine
SIH26014 - Ministry of Rural Development / Department of Land Resources (DoLR)
Dataset: LAND_STACK_SIH26014_Demo_Data Integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
from datetime import datetime

app = FastAPI(
    title="Land Stack AI Governance Service",
    description="Explainable AI decision-support endpoints integrated with LAND_STACK_SIH26014_Demo_Data.",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Data Models ---

class TaxRiskRequest(BaseModel):
    ulpin: str
    annual_tax: float = 12000.0
    paid_amount: float = 4000.0
    outstanding_amount: float = 8000.0
    days_overdue: int = 730
    missed_payments_count: int = 2

class RiskFactor(BaseModel):
    name: str
    impact: float

class StandardAiResponse(BaseModel):
    ulpin: str
    riskScore: float = Field(..., description="Risk Score from 0 to 100")
    riskLevel: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    finding: str
    confidence: float
    factors: List[RiskFactor]
    evidence: List[str]
    recommendation: str
    requiresHumanReview: bool = True
    modelName: str = "landstack-risk-v1"
    modelVersion: str = "1.0.0"
    disclaimer: str = "This is an AI-generated decision-support signal. Final determination must be made by an authorized officer."

class MutationAnomalyRequest(BaseModel):
    ulpin: str
    mutations_18_months: int = 4
    ownership_changes: int = 2
    missing_registration_link: bool = True

class DocumentConsistencyRequest(BaseModel):
    ulpin: str
    document_id: str = "DOC_001"
    extracted_survey_number: str = "125/1"
    db_survey_number: str = "125/2"
    extracted_owner_name: str = "Vijay Jadhav"
    db_owner_name: str = "Vijay Kumar Jadhav"

class BoundaryConflictRequest(BaseModel):
    parcel_a_ulpin: str = "MH-27-PUN-000002"
    parcel_b_ulpin: str = "MH-27-PUN-000003"
    overlap_area_sqm: float = 130.0

class PlanningConflictRequest(BaseModel):
    ulpin: str = "MH-27-PUN-000003"
    land_use: str = "Agricultural"
    zoning: str = "Residential Zone R2"
    master_plan_reservation: str = "30m PMRDA Ring Road Alignment"

class UtilityAnomalyRequest(BaseModel):
    ulpin: str
    water_status: str = "Connected"
    water_outstanding: float = 8500.0
    electricity_status: str = "Active"
    electricity_outstanding: float = 1200.0

class LandAssistantRequest(BaseModel):
    ulpin: Optional[str] = "MH-27-PUN-000003"
    query: str
    user_role: str = "REVENUE_OFFICER"
    state_code: str = "ST_MH"

class LandAssistantResponse(BaseModel):
    query: str
    answer: str
    fact: str
    inference: str
    recommendation: str
    disclaimer: str = "Grounded strictly in Land Stack platform records."

# --- API Endpoints ---

@app.get("/health")
@app.get("/api/ai/health")
def health_check():
    return {
        "status": "UP",
        "service": "Land Stack AI Governance Service",
        "dataset": "LAND_STACK_SIH26014_Demo_Data Integrated",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ai/tax-risk", response_model=StandardAiResponse)
def evaluate_tax_risk(req: TaxRiskRequest):
    outstanding = req.outstanding_amount
    overdue_years = req.days_overdue / 365.0
    
    score = min(100.0, (outstanding / max(1.0, req.annual_tax)) * 40.0 + overdue_years * 25.0)
    level = "CRITICAL" if score >= 76 else ("HIGH" if score >= 51 else ("MEDIUM" if score >= 21 else "LOW"))
    
    return StandardAiResponse(
        ulpin=req.ulpin,
        riskScore=round(score, 1),
        riskLevel=level,
        finding="High Tax Arrears Risk Detected",
        confidence=0.94,
        factors=[
            RiskFactor(name="Outstanding Balance", impact=round(outstanding, 2)),
            RiskFactor(name="Overdue Duration (Years)", impact=round(overdue_years, 1))
        ],
        evidence=[
            f"Outstanding balance: ₹{req.outstanding_amount:,.2f}",
            f"Overdue duration: {overdue_years:.1f} years ({req.days_overdue} days)",
            f"Missed payments: {req.missed_payments_count}"
        ],
        recommendation="Generate tax reminder / initiate recovery workflow.",
        requiresHumanReview=True
    )

@app.post("/api/ai/dispute-risk", response_model=StandardAiResponse)
def evaluate_dispute_risk(payload: Dict[str, Any]):
    ulpin = payload.get("ulpin", "MH-27-PUN-000003")
    score = 78.0
    return StandardAiResponse(
        ulpin=ulpin,
        riskScore=score,
        riskLevel="HIGH",
        finding="Potential Dispute & Legal Risk",
        confidence=0.87,
        factors=[
            RiskFactor(name="Ownership Transfers (4 in 3 yrs)", impact=25.0),
            RiskFactor(name="Active Revenue Court Litigation", impact=20.0),
            RiskFactor(name="Cadastral Boundary Overlap", impact=18.0),
            RiskFactor(name="Inconsistent Mutation History", impact=15.0)
        ],
        evidence=[
            "4 ownership changes within 36 months",
            "Active litigation CS/2024/9912 (Civil Court Pune)",
            "Boundary overlap of 130 m² with Survey Plot 124/2",
            "Missing registration deed link for Ferfar Entry 1901"
        ],
        recommendation="Revenue officer review recommended.",
        requiresHumanReview=True
    )

@app.post("/api/ai/parcel-risk", response_model=StandardAiResponse)
def calculate_unified_parcel_risk(payload: Dict[str, Any]):
    ulpin = str(payload.get("ulpin", "MH-27-PUN-000001")).strip()
    
    # Parcel C: Multi-Risk High Alert Parcel
    if "000003" in ulpin:
        return StandardAiResponse(
            ulpin=ulpin,
            riskScore=82.0,
            riskLevel="HIGH",
            finding="Multi-Risk Parcel Alert (Dispute, Overlap & Tax Arrears)",
            confidence=0.93,
            factors=[
                RiskFactor(name="Active Civil Court Litigation", impact=30.0),
                RiskFactor(name="Cadastral Geometry Overlap (130 m²)", impact=25.0),
                RiskFactor(name="Property Tax Arrears", impact=15.0),
                RiskFactor(name="Frequent Mutations (3 in 18 mos)", impact=12.0)
            ],
            evidence=[
                "Active litigation CS/2024/9912 in Civil Court Pune",
                "130 m² spatial geometry overlap with adjoining plot 124/2",
                "₹8,000 overdue property tax arrears",
                "3 mutation entries recorded within past 18 months"
            ],
            recommendation="Initiate multi-departmental field verification and officer review.",
            requiresHumanReview=True
        )
    # Parcel D: Satellite Change & Planning Conflict
    elif "000004" in ulpin:
        return StandardAiResponse(
            ulpin=ulpin,
            riskScore=55.0,
            riskLevel="MEDIUM",
            finding="Satellite Structural Change Detected (0.14 Ha)",
            confidence=0.89,
            factors=[
                RiskFactor(name="Unauthorized Construction Indicator", impact=45.0),
                RiskFactor(name="Agricultural Zone A1 Impact", impact=10.0)
            ],
            evidence=[
                "Baseline satellite image: Agricultural clear land",
                "Current satellite feed: New structural footprint detected (0.14 Ha)",
                "Zoning classification: Agricultural Zone A1"
            ],
            recommendation="Planning department field inspection recommended.",
            requiresHumanReview=True
        )
    # Parcel B: Commercial & Joint Khatedar Share
    elif "000002" in ulpin:
        return StandardAiResponse(
            ulpin=ulpin,
            riskScore=28.0,
            riskLevel="LOW",
            finding="Joint Ownership & Commercial Zoning Clear",
            confidence=0.92,
            factors=[
                RiskFactor(name="Joint Khatedar Ownership (50% Share)", impact=15.0),
                RiskFactor(name="Commercial IT Park Zone B", impact=13.0)
            ],
            evidence=[
                "50% joint Khatedar ownership share with S. K. Deshmukh",
                "Sub-Registrar office deed REG-PUN-2020-0192 verified",
                "Property tax paid in full (₹14,500)",
                "Zero boundary overlap or litigation"
            ],
            recommendation="No action required. Standard joint holding.",
            requiresHumanReview=False
        )
    # Tamil Nadu Patta Parcel
    elif "TN" in ulpin.upper():
        return StandardAiResponse(
            ulpin=ulpin,
            riskScore=15.0,
            riskLevel="LOW",
            finding="Tamil Nadu Patta & Chitta Record Clear",
            confidence=0.95,
            factors=[
                RiskFactor(name="Patta Transfer Verification", impact=10.0),
                RiskFactor(name="Nanjai Agricultural Classification", impact=5.0)
            ],
            evidence=[
                "Official Patta #1082 verified with Kanchipuram Collectorate",
                "No boundary dispute or encumbrance registered",
                "Agricultural Nanjai tax dues cleared"
            ],
            recommendation="No action required.",
            requiresHumanReview=False
        )
    # Punjab Jamabandi Parcel
    elif "PB" in ulpin.upper():
        return StandardAiResponse(
            ulpin=ulpin,
            riskScore=18.0,
            riskLevel="LOW",
            finding="Punjab Jamabandi Fard Record Clear",
            confidence=0.94,
            factors=[
                RiskFactor(name="Jamabandi Entry Verification", impact=10.0),
                RiskFactor(name="Chahi Irrigated Classification", impact=8.0)
            ],
            evidence=[
                "Jamabandi Fard extract #402 verified with Amritsar Tehsil",
                "Zero active Intqal mutation dispute",
                "Land revenue tax up to date"
            ],
            recommendation="No action required.",
            requiresHumanReview=False
        )
    # Parcel A & Default (Paud Agricultural Plot MH-27-PUN-000001)
    else:
        return StandardAiResponse(
            ulpin=ulpin,
            riskScore=12.0,
            riskLevel="LOW",
            finding="Parcel Records Verified Clear & Compliant",
            confidence=0.96,
            factors=[
                RiskFactor(name="Regular Tax Compliance", impact=8.0),
                RiskFactor(name="100% Sole Khatedar Ownership", impact=4.0)
            ],
            evidence=[
                "No active boundary overlaps or spatial intersections",
                "Clean 7/12 & 8A RoR record (Paud Plot #123/4)",
                "Annual property tax paid in full (₹9,000)",
                "Zero civil litigation or revenue disputes"
            ],
            recommendation="No action required. Parcel status verified clear.",
            requiresHumanReview=False
        )

@app.post("/api/ai/boundary-conflict", response_model=StandardAiResponse)
def evaluate_boundary_conflict(req: BoundaryConflictRequest):
    overlap = req.overlap_area_sqm
    score = min(100.0, 50.0 + overlap * 0.3)
    level = "CRITICAL" if score >= 76 else ("HIGH" if score >= 51 else ("MEDIUM" if score >= 21 else "LOW"))
    return StandardAiResponse(
        ulpin=req.parcel_a_ulpin,
        riskScore=round(score, 1),
        riskLevel=level,
        finding=f"Boundary Overlap Conflict Detected ({overlap} m²)",
        confidence=0.91,
        factors=[
            RiskFactor(name="Cadastral Overlap Area", impact=round(overlap, 1))
        ],
        evidence=[
            f"Spatial geometry overlap of {overlap} m² between {req.parcel_a_ulpin} and {req.parcel_b_ulpin}"
        ],
        recommendation="Order joint ground surveyor re-measurement.",
        requiresHumanReview=True
    )

@app.post("/api/ai/change-detection")
def detect_satellite_change(payload: Dict[str, Any]):
    ulpin = payload.get("ulpin", "MH-27-PUN-000004")
    return {
        "ulpin": ulpin,
        "changeDetected": True,
        "confidence": 0.89,
        "changeType": "UNAUTHORIZED_CONSTRUCTION_INDICATOR",
        "affectedParcel": ulpin,
        "details": "0.14 Ha structural footprint anomaly detected compared to baseline satellite imagery."
    }

@app.post("/api/ai/assistant", response_model=LandAssistantResponse)
@app.post("/api/ai/assistant/query", response_model=LandAssistantResponse)
def query_land_assistant(req: LandAssistantRequest):
    q = req.query.lower()
    ulpin = req.ulpin or "MH-27-PUN-000003"

    if "dispute" in q or "litigation" in q or "risk" in q:
        return LandAssistantResponse(
            query=req.query,
            answer=f"Parcel {ulpin} is marked HIGH RISK due to active civil court dispute CS/2024/9912 regarding boundary overlap of 130 m².",
            fact=f"ULPIN {ulpin} is flagged under High Dispute Risk with CS/2024/9912.",
            inference="Active litigation indicates potential ownership/boundary contestation.",
            recommendation="Verify court stay orders before proceeding with mutation."
        )
    elif "tax" in q or "dues" in q or "payment" in q:
        return LandAssistantResponse(
            query=req.query,
            answer=f"Parcel {ulpin} has outstanding property tax dues of ₹8,000 for 2 consecutive years.",
            fact="Tax arrears of ₹8,000 logged under ULB Revenue System.",
            inference="Missed payments for 2 billing cycles.",
            recommendation="Issue tax recovery notice to registered Khatedar."
        )
    else:
        return LandAssistantResponse(
            query=req.query,
            answer=f"Parcel {ulpin} is a registered land plot in Maharashtra with canonical Person ID LS-PER-00000125.",
            fact=f"ULPIN {ulpin} maps to survey plot 123/4 in Paud village.",
            inference="Canonical spatial boundary and owner relationships are established.",
            recommendation="Use dossier modal to inspect specific RoR or spatial layers."
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

