package com.landstack.adapter;

import java.util.List;
import java.util.Map;

public interface StateLandDataAdapter {
    String getStateCode();
    String getStateName();
    List<String> getSupportedDocumentTypes();
    Map<String, String> getFieldMappings();
    NormalizedLandRecord normalizeRecord(Map<String, Object> rawSourceRecord);
}
