# DNS for AI Discovery (DNS-AID) Setup Guide

To resolve the DNS-AID well-known entrypoint records warning, you need to publish DNS records under your domain. These records must be set up at your DNS provider (e.g. Cloudflare, AWS Route 53, or GoDaddy) and cannot be configured in the Next.js codebase.

## 1. Publish DNS-AID Records

Add the following standard ServiceMode `SVCB` or `HTTPS` records to your DNS zone file:

```text
# Index discovery record
_index._agents.paymm.in.   3600 IN HTTPS 1 . alpn="h2,h3" port="443" ipv4hint="..." ipv6hint="..."

# Agent-to-Agent (A2A) discovery record
_a2a._agents.paymm.in.     3600 IN HTTPS 1 . alpn="h2,h3" port="443" ipv4hint="..." ipv6hint="..."
```

*Note: Replace `ipv4hint` and `ipv6hint` with your server's IP addresses.*

## 2. Sign with DNSSEC

Ensure that DNSSEC is enabled for your domain (`paymm.in`) in your DNS manager. DNSSEC signs the public discovery zone so validating resolvers can authenticate the discovery metadata securely.
