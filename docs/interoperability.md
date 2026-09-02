# LAND STACK — Phase 6 Interoperability & Data Integration Architecture

## 1. Overview
Land governance in India is a state subject under the Constitution of India. Consequently, individual states maintain independent land records with distinct database schemas, field names, language terminology, and area measurement units.

The **LAND STACK Interoperability Layer** acts as a Digital Public Infrastructure (DPI) bridge that ingests heterogeneous state revenue payloads (Maharashtra 7/12 & 8A, Tamil Nadu Patta/Chitta, Punjab Jamabandi Fard), validates source schemas, normalizes area units, and produces a single **Canonical Land Stack Model** linked to a unique ULPIN.

---

## 2. Core Architectural Principles

1. **Source Truth Preservation**: The original raw state JSON payload is stored 100% untouched alongside the normalized canonical entity (`sourceState`, `sourceDepartment`, `sourceSystem`, `sourceRecordType`, `sourceRecordId`, `sourcePayload`, `schemaVersion`).
2. **Unit Normalization Engine**: Converts non-metric area units (e.g. Acres/Cents to Hectares or Kanal/Marla to Hectares) while retaining `originalValue`, `originalUnit`, `normalizedValue` (Hectares), and `normalizedUnit`.
3. **Canonical Parcel Model**: All state records map into a common parcel entity connected to PostGIS geometries, department workflows, explainable AI risk scores, and citizen services.

---

## 3. Supported State Adapters Matrix

| State | Source Systems & Documents | Key Field Mappings | Unit Normalization |
| :--- | :--- | :--- | :--- |
| **Maharashtra (`MH`)** | MahaBhulekh 7/12 Extract, 8A Extract, Ferfar Mutation | `khatedarName` $\rightarrow$ `ownerName`<br>`surveyNo` $\rightarrow$ `surveyNumber`<br>`areaHectare` $\rightarrow$ `area` | Hectares $\rightarrow$ Hectares (Direct) |
| **Tamil Nadu (`TN`)** | Tamil Nilam Patta Extract, Chitta, Adangal Register | `pattaHolder` $\rightarrow$ `ownerName`<br>`surveyNumber` $\rightarrow$ `surveyNumber`<br>`extentAcres` $\rightarrow$ `area` | 1 Acre = 0.404686 Hectares |
| **Punjab (`PB`)** | PLRS Jamabandi Fard, Intqal Mutation, Khasra Girdawari | `ownerName` $\rightarrow$ `ownerName`<br>`khasraNumber` $\rightarrow$ `surveyNumber`<br>`areaKanalMarla` $\rightarrow$ `area` | 1 Kanal = 0.0505857 Hectares,<br>1 Marla = 0.002529 Hectares |

---

## 4. Versioned Interoperability REST APIs (`/api/v1/integration/*`)

- `GET /api/v1/integration/states`: Supported states and active adapter status.
- `GET /api/v1/integration/states/{stateCode}/schema`: Source schema and canonical mapping definitions.
- `GET /api/v1/integration/adapters`: Active state adapters metadata.
- `POST /api/v1/integration/validate`: Schema validation without persistence.
- `POST /api/v1/integration/normalize`: Payload conversion into canonical representation.
- `POST /api/v1/integration/ingest`: Full ingestion pipeline execution.
- `GET /api/v1/integration/records/{ulpin}/sources`: Raw state source payload.
- `GET /api/v1/integration/records/{ulpin}/canonical`: Normalized canonical Land Stack record.
