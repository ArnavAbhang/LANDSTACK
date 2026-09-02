# State Adapter & Data Normalization Architecture

## 1. Concept
Since land governance in India is administered independently by individual state revenue departments, data models, field naming conventions, and document formats differ significantly across state borders.

Land Stack provides a flexible **State Adapter Framework** that consumes state-specific payloads, performs validation, maps fields dynamically, and outputs a standardized `LandStackParcel` object.

---

## 2. Standardized vs. State-Specific Fields Mapping Matrix

| Common Normalized Field | Maharashtra (MH) Source | Tamil Nadu (TN) Source | Punjab (PB) Source |
| :--- | :--- | :--- | :--- |
| `ulpin` | ULPIN / 14-digit survey key | ULPIN / Patta Parcel Code | ULPIN / Khewat Parcel ID |
| `ownerName` | `khatedarName` | `pattaHolder` | `ownerName` |
| `surveyNumber` | `surveyNo` / `gatNo` | `surveyNumber` | `khasraNumber` |
| `area` | `areaHectare` (Ha) | `extent` (Acre / Cent) | `areaKanalMarla` |
| `landClassification` | `jameenPrakar` / `bhogwata` | `landType` (Nanjai/Punjai) | `landCategory` |
| `primaryDocument` | 7/12 Extract, 8A | Patta, Adangal | Jamabandi |
| `mutationRecord` | Mutation Entry (Ferfar) | Patta Transfer | Mutation (Intqal) |

---

## 3. Data Transformation Pipeline

```
[Raw State Payload] 
       ↓
[State Land Data Adapter] → Validate JSON Schema
       ↓
[Field Mapper] → Translate local terms to canonical fields
       ↓
[Unit Converter] → Standardize area measurements to Square Meters / Hectares
       ↓
[Normalized Land Stack Record] → Persist to PostGIS database under ULPIN
```
