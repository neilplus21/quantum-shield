# Blockchain-IoT Integration with Extended Proof-of-Luck Consensus and Energy-Aware Clustering for Post-Quantum Security

A research prototype and interactive visualization platform demonstrating a **Blockchain-IoT (BIoT) framework** that integrates energy-aware clustering, an Extended Delegated Proof-of-Luck consensus mechanism, and post-quantum cryptography for secure and scalable IoT networks.

The project includes an **interactive web dashboard and automated simulation demo** that visualizes the entire system pipeline from IoT device discovery to blockchain logging.

---

# Overview

The rapid growth of Internet-of-Things (IoT) deployments introduces major challenges related to **security, scalability, energy consumption, and trust management**.

Traditional centralized architectures struggle to provide:

* tamper-proof data storage
* fair device coordination
* energy-efficient communication
* quantum-resistant security

This project presents a **Blockchain-IoT framework** that addresses these issues by combining:

Energy-aware clustering
Extended Delegated Proof-of-Luck consensus
Post-quantum hybrid encryption
Smart contract-based blockchain logging

The system demonstrates how IoT telemetry can be **securely aggregated, encrypted, validated, and immutably stored on a blockchain network**.

---

# System Architecture

The architecture integrates multiple layers of distributed systems and cryptography.

Pipeline:

```
IoT Devices
   ↓
Neighbor Discovery
   ↓
Energy-Aware Clustering
   ↓
Cluster Head Selection (MCDM / WSM)
   ↓
Cluster Data Aggregation
   ↓
Extended Delegated Proof-of-Luck Consensus
   ↓
Post-Quantum Encryption (Kyber-512 + AES-GCM)
   ↓
Smart Contract Logging
   ↓
Blockchain Storage
```

The interactive dashboard visually demonstrates each stage.

---

# Key Features

### Energy-Aware Clustering

Cluster heads are selected using a **Multi-Criteria Decision Making (MCDM)** algorithm based on:

* residual energy
* CPU capability
* connectivity
* fairness

This improves network lifetime and balances workload across IoT devices.

---

### Extended Delegated Proof-of-Luck Consensus

A lightweight blockchain consensus designed for **resource-constrained IoT networks**.

Key properties:

* software-based randomness
* median-based proposer selection
* PBFT-style committee validation
* low latency and energy overhead

---

### Post-Quantum Cryptography

The framework integrates **lattice-based cryptography** to protect IoT data against future quantum attacks.

Hybrid encryption pipeline:

```
Kyber-512 (Key Encapsulation)
        ↓
Shared Secret
        ↓
AES-256-GCM Encryption
        ↓
Encrypted IoT Payload
```

The encrypted data package includes:

* ciphertext
* nonce
* authentication tag
* Kyber ciphertext

---

### Blockchain Logging

Encrypted payloads are logged to the **Ethereum Sepolia test network** via a smart contract.

This provides:

* tamper-proof data storage
* decentralized verification
* transparent audit trails

---

# Interactive Web Platform

The repository includes a **multi-page visualization dashboard** that explains and demonstrates the architecture.

Pages include:

Dashboard
Live Demo Simulation
IoT Network Layer
Clustering Mechanism
Consensus Protocol
Post-Quantum Encryption
Blockchain Logging
Research Overview

The **Live Demo page automatically runs the full system pipeline**.

---


# Tech Stack

### Frontend

React
Vite
TailwindCSS
Framer Motion

### Backend

Python
FastAPI
Web3.py

### Blockchain

Ethereum Sepolia Testnet
Solidity Smart Contract
Infura RPC

### Cryptography

Kyber-512 (ML-KEM)
AES-256-GCM
PyCryptodome

---

# Installation

Clone the repository

```
git clone https://github.com/neilplus21/quantum-shield.git
cd quantum-shield
```

---

# Backend Setup

Install dependencies

```
cd backend
pip install -r requirements.txt
```

Start the FastAPI server

```
uvicorn api:app --reload
```

Server runs at

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Open the dashboard

```
http://localhost:5173
```

---

# Demo Workflow

The automated demo simulates the full distributed system pipeline.

Steps:

1. IoT devices initialize
2. Neighbor discovery runs
3. Cluster heads are selected
4. Sensor data is aggregated
5. Extended DPoL consensus selects a proposer
6. IoT payload is encrypted using post-quantum cryptography
7. Encrypted data is logged to Ethereum blockchain
8. Transaction hash is displayed

---

# Example Encrypted Payload

```
{
  "ciphertext": "...",
  "iv": "...",
  "tag": "...",
  "kem_ciphertext": "..."
}
```

---

# Research Contributions

• Integration of blockchain and IoT architectures
• Multi-criteria cluster head selection mechanism
• Extended Delegated Proof-of-Luck consensus protocol
• Hybrid post-quantum encryption pipeline
• Interactive architecture visualization dashboard

---

# Future Work

Potential improvements include:

* deployment on real IoT hardware
* real-time sensor integration
* distributed blockchain nodes
* scalability testing on larger networks
* integration with additional PQC schemes

---


# License

MIT License

---

# Citation

If you use this project in research, please cite the corresponding paper:

```
Blockchain-IoT Integration with Extended Proof-of-Luck Consensus and Energy-Aware Clustering for Post-Quantum Security
```
