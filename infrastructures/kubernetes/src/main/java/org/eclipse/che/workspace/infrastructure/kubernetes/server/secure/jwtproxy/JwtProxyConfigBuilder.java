/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.workspace.infrastructure.kubernetes.server.secure.jwtproxy;

import static org.eclipse.che.workspace.infrastructure.kubernetes.server.secure.jwtproxy.JwtProxyProvisioner.JWT_PROXY_CONFIG_FOLDER;
import static org.eclipse.che.workspace.infrastructure.kubernetes.server.secure.jwtproxy.JwtProxyProvisioner.JWT_PROXY_PUBLIC_KEY_FILE;

import java.util.ArrayList;
import java.util.List;

/**
 * Helps to build JWTProxy config with several verifier proxies.
 *
 * @author Sergii Leshchenko
 */
public class JwtProxyConfigBuilder {
  private final List<VerifierProxy> verifierProxies = new ArrayList<>();
  private final String workspaceId;

  public JwtProxyConfigBuilder(String workspaceId) {
    this.workspaceId = workspaceId;
  }

  public void addVerifierProxy(Integer listenPort, String upstream) {
    verifierProxies.add(new VerifierProxy(listenPort, upstream));
  }

  public String build() {
    StringBuilder configBuilder = new StringBuilder();

    configBuilder.append("jwtproxy:\n" + "  verifier_proxies:\n");
    for (VerifierProxy verifierProxy : verifierProxies) {
      configBuilder.append(
          String.format(
              "  - listen_addr: :%s\n" // :4471
                  + "    verifier:\n"
                  + "      upstream: %s/\n" // http://localhost:4401
                  + "      audience: http://%s\n"
                  + "      max_skew: 1m\n"
                  + "      max_ttl: 3h\n"
                  + "      key_server:\n"
                  + "        type: preshared\n"
                  + "        options:\n"
                  + "          issuer: wsmaster\n"
                  + "          key_id: mykey\n"
                  + "          public_key_path: "
                  + JWT_PROXY_CONFIG_FOLDER
                  + "/"
                  + JWT_PROXY_PUBLIC_KEY_FILE
                  + "\n"
                  + "      claims_verifiers:\n"
                  + "      - type: static\n"
                  + "        options:\n"
                  + "          iss: wsmaster\n"
                  + "      nonce_storage:\n"
                  + "        type: void\n",
              verifierProxy.listenPort,
              verifierProxy.upstream,
              workspaceId));
    }
    configBuilder.append("  signer_proxy:\n" + "    enabled: false\n");
    return configBuilder.toString();
  }

  private class VerifierProxy {
    private Integer listenPort;
    private String upstream;

    VerifierProxy(Integer listenPort, String upstream) {
      this.listenPort = listenPort;
      this.upstream = upstream;
    }
  }
}
