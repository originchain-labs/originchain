# Security Policy

## Supported Versions

OriginChain has no versioned/tagged releases at this time. The `dev` branch
(and `main`, once release branches exist) is the only supported line —
security fixes are applied there, not backported to older commits.

## Scope Note: Testnet-Only Deployment

All current deployments of OriginChain's smart contracts
(`CreatorRegistry`, `AssetRegistry`, `ReviewRegistry`, `ReputationManager`)
are on **Arbitrum Sepolia (testnet) only**. Nothing in this repository is
deployed to Arbitrum mainnet.

This means smart contract vulnerabilities, while taken seriously and worth
reporting, currently carry **no real-fund risk** — there are no real assets
or mainnet funds at stake. That does not lower the bar for responsible
disclosure: please report vulnerabilities privately rather than exploiting
them or disclosing them publicly before a fix ships, so the reporting
process stays trustworthy as the project moves toward a production
deployment.

## Reporting a Vulnerability

Please report security vulnerabilities using GitHub's private security
advisory feature for this repository:

**Settings → Security → Report a vulnerability**

This creates a private disclosure channel with maintainers rather than a
public issue. If that feature is not enabled on this repository at the time
of your report, open a regular GitHub issue with minimal detail
(no exploit specifics) flagging that you have a security report, and a
maintainer will follow up with a private channel.

There is currently no dedicated security contact email — please do not
assume one exists or send reports to unverified addresses claiming to be
associated with this project.

When reporting, please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce (or a proof of concept)
- Any relevant logs, transaction hashes, or affected endpoints/contracts

We will acknowledge reports as promptly as possible and keep you informed as
a fix is developed.
