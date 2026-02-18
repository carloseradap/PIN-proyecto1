# 🚀 Proyecto Final Diplomado DevOps  
## CI/CD Seguro para Aplicación Containerizada en AWS  

### MundosE – DevOps2502 – Grupo 8  
- Escalante, Eliany  
- Rada, Carlos  
- Zeledon, Silvia  

---

![CI/CD](https://github.com/MundosE/PIN-proyecto1/actions/workflows/deploy.yml/badge.svg)  
![Node](https://img.shields.io/badge/node-20.x-green)  
![Docker](https://img.shields.io/badge/docker-enabled-blue)  
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20ECR-orange)  
![Security](https://img.shields.io/badge/Security-ESLint%20%7C%20Snyk%20%7C%20SBOM-success)  
![Status](https://img.shields.io/badge/Status-Academic%20Project-blueviolet)

---

# 1. Descripción General

Pipeline completo de Integración Continua y Entrega Continua (CI/CD) para una SPA desarrollada con React + TypeScript + Vite, desplegada en AWS con prácticas DevSecOps y observabilidad completa.

---

# 2. Arquitectura General

## Diagrama de Arquitectura AWS

```mermaid
flowchart TB
    Dev[Developer] --> Repo[GitHub Repository]
    Repo --> Actions[GitHub Actions]
    Actions --> Registry[(Amazon ECR)]
    Registry -->|docker pull| EC2[EC2 Instance]
    EC2 --> Docker[Docker Engine]
    Docker --> App[App Container - Nginx]
    Docker --> NodeExp[Node Exporter]
    Docker --> cAdv[cAdvisor]
    NodeExp --> Prom[Prometheus]
    cAdv --> Prom
    Prom --> Graf[Grafana]
```

---

# 3. Pipeline CI/CD

## Diagrama del Pipeline

```mermaid
flowchart LR
    A[Push to main] --> B[Checkout]
    B --> C[npm ci]
    C --> D[Type Check]
    D --> E[ESLint]
    E --> F[Snyk Scan]
    F --> G[Docker Build]
    G --> H[Generate SBOM]
    H --> I[Push to ECR]
    I --> J[Deploy EC2]
```

---

# 4. Seguridad

- ESLint
- TypeScript
- Snyk (dependencias + imagen Docker)
- SBOM CycloneDX con Syft
- GitHub Secrets
- IAM Role en EC2

---

# 5. Infraestructura AWS

- EC2 t2.micro (Free Tier)
- Amazon ECR privado
- Docker Engine
- Prometheus + Node Exporter + cAdvisor + Grafana

---

# 6. Observabilidad

Monitoreo de CPU, memoria, disco, red y estado de contenedores mediante Prometheus y dashboards personalizados en Grafana.

---

# 7. Conclusión

Arquitectura automatizada, segura y monitoreada que integra CI/CD, DevSecOps, infraestructura cloud y observabilidad completa.
