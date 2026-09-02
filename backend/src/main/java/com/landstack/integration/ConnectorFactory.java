package com.landstack.integration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ConnectorFactory {

    private final Map<String, ExternalDataConnector> connectorMap = new HashMap<>();

    @Autowired
    public ConnectorFactory(List<ExternalDataConnector> connectorList) {
        for (ExternalDataConnector conn : connectorList) {
            connectorMap.put(conn.getProtocol().toUpperCase(), conn);
        }
    }

    public ExternalDataConnector getConnector(String protocol) {
        if (protocol == null) return connectorMap.get("REST");
        return connectorMap.getOrDefault(protocol.toUpperCase(), connectorMap.get("REST"));
    }

    public Collection<ExternalDataConnector> getAllConnectors() {
        return Collections.unmodifiableCollection(connectorMap.values());
    }
}
