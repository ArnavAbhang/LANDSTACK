package com.landstack.integration;

import java.util.Map;

public interface ExternalDataConnector {
    String getSourceId();
    String getProtocol();
    Map<String, Object> fetchPayload(Map<String, Object> params);
    boolean validateConnection();
}
