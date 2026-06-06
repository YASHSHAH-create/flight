# Agent Registration Protocol (auth.md)

Welcome to Paymm! This document describes how AI agents can register and obtain API credentials to interact with our travel booking APIs autonomously.

## Registration Flow

To request access, POST to our registration endpoint:

```http
POST /api/agent/register HTTP/1.1
Host: paymm.in
Content-Type: application/json

{
  "agent_name": "MyTravelAgent",
  "identity_type": "id-jag",
  "assertion": "<cryptographic-assertion>"
}
```

For more details, refer to [OAuth Protected Resource Metadata](/.well-known/oauth-protected-resource) and [OAuth Authorization Server](/.well-known/oauth-authorization-server).
