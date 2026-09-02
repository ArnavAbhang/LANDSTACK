-- Land Stack Migration V27: Production B-Tree Composite Indexes

-- Optimization for Parcel lookup and state jurisdiction filtering
CREATE INDEX IF NOT EXISTS idx_parcels_jurisdiction ON parcels(state_code, district_id, taluka_id, village_id);
CREATE INDEX IF NOT EXISTS idx_parcels_survey ON parcels(survey_number);
CREATE INDEX IF NOT EXISTS idx_parcels_owner ON parcels(owner_name);

-- Optimization for Workflow Cases and Service Requests
CREATE INDEX IF NOT EXISTS idx_service_req_jurisdiction ON service_requests(state_code, district_id, taluka_id, village_id);
CREATE INDEX IF NOT EXISTS idx_service_req_type_status ON service_requests(request_type, status);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_officer_stage ON workflow_cases(current_officer, current_stage);

-- Optimization for SLA Tracking and Escalation
CREATE INDEX IF NOT EXISTS idx_sla_status_deadline ON sla_tracking(sla_status, deadline);

-- Optimization for Audit Log Inspection
CREATE INDEX IF NOT EXISTS idx_audit_time_actor ON audit_logs(timestamp, user_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);

-- Optimization for Integration Jobs
CREATE INDEX IF NOT EXISTS idx_int_jobs_source_status ON integration_jobs(source_id, status);
