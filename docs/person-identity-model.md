# LAND STACK — Person Identity Model Specification

## 1. Core Identity Principle
In **LAND STACK (SIH26014)**, owner names are explicitly treated as **non-unique attributes**. The platform establishes a separate, canonical identity layer (`Person ID`, e.g. `LS-PER-00000125`) that decouples personal identity from land parcels (`ULPIN`).

$$\text{PERSON (Person ID)} \longrightarrow \text{OWNERSHIP (Share, Type, Status)} \longrightarrow \text{ULPIN} \longrightarrow \text{PARCEL}$$

- **ULPIN**: Identifies LAND.
- **Person ID**: Identifies PERSON (application-level identifier, avoiding public exposure of Aadhaar).
- **Ownership**: Identifies the relationship between PERSON and LAND.

## 2. Duplicate Name Disambiguation
When multiple individuals share the identical legal name (e.g. "Rahul Anil Deshmukh"), LAND STACK maintains distinct Person records:
- `LS-PER-00000125`: Rahul Anil Deshmukh (Haveli Taluka, Pune - 3 parcels).
- `LS-PER-00000487`: Rahul Anil Deshmukh (Mulshi Taluka, Pune - 1 parcel).

Searching by owner name presents officers with distinct candidate cards, preventing false identity merges.
