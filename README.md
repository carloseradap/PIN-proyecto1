# Proyecto Final Diplomado DevOps - CI/CD Seguro en AWS

## MundosE -- DevOps2502 -- Grupo 8
## -Escalante, Eliany
## -Rada, Carlos
## -Zeledon, Silvia

### Proyecto 1: CI/CD con GitHub Actions + Terraform + Docker (AWS)

![CI/CD](https://github.com/MundosE/PIN-proyecto1/actions/workflows/deploy.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20.x-green)
![Docker](https://img.shields.io/badge/docker-enabled-blue)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20ECR-orange)
![Security](https://img.shields.io/badge/Security-ESLint%20%7C%20Snyk%20%7C%20SBOM-success)
![License](https://img.shields.io/badge/Status-Academic%20Project-blueviolet)

📌 1. Descripción General

Este proyecto implementa un pipeline completo de Integración Continua y Entrega Continua (CI/CD) para una aplicación SPA desarrollada con React + TypeScript + Vite, desplegada en AWS utilizando infraestructura como código y prácticas de DevSecOps.

Se integran:

CI/CD automatizado

Contenerización con Docker

Infraestructura en AWS (EC2 + ECR)

Seguridad integrada (Snyk + ESLint + SBOM)

Observabilidad (Prometheus + Grafana)

🏗️ 2. Arquitectura General

### 🔹 Diagrama de Arquitectura AWS

```mermaid
flowchart TB

    subgraph GitHub
        Dev[Developer]
        Repo[GitHub Repository]
        Actions[GitHub Actions]
    end

    subgraph AWS
        subgraph ECR
            Registry[(Amazon ECR)]
        end

        subgraph EC2
            Docker[Docker Engine]
            App[App Container - Nginx]
            NodeExp[Node Exporter]
            cAdv[cAdvisor]
            Prom[Prometheus]
            Graf[Grafana]
        end
    end

    Dev --> Repo
    Repo --> Actions
    Actions --> Registry

    Registry -->|docker pull| Docker
    Docker --> App

    Docker --> NodeExp
    Docker --> cAdv

    NodeExp --> Prom
    cAdv --> Prom
    Prom --> Graf



---

🔁 3. Pipeline CI/CD

```markdown
## 🔁 3. Pipeline CI/CD

### 📦 Diagrama del Pipeline

```mermaid
flowchart LR

    subgraph DEV["👨‍💻 Desarrollo"]
        A[Developer]
        B[GitHub Repository]
    end

    A -->|Push to main| B

    subgraph CI["⚙️ GitHub Actions Pipeline"]
        C[Checkout]
        D[npm ci]
        E[Type Check]
        F[ESLint]
        G[Snyk Scan]
        H[Docker Build]
        I[Generate SBOM]
        J[Push to ECR]
    end

    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J

    subgraph AWS["☁️ AWS"]
        K[(Amazon ECR)]
        L[EC2 Instance]
        M[Docker Runtime]
        N[App Running]
    end

    J --> K
    K -->|docker pull| L
    L --> M
    M --> N


🔹 Etapas del Pipeline

1️⃣ Checkout del código
2️⃣ Instalación determinística (npm ci)
3️⃣ Validación TypeScript
4️⃣ Análisis estático ESLint
5️⃣ Escaneo de dependencias con Snyk
6️⃣ Build Docker multi-stage
7️⃣ Generación SBOM con Syft
8️⃣ Push de imagen a Amazon ECR
9️⃣ Deploy automático vía SSH en EC2

🐳 4. Contenerización
Docker Multi-Stage

Stage 1 – Build

node:20-alpine

npm ci

npm run build

Stage 2 – Runtime

nginx:alpine

Sirve carpeta /dist

Expone puerto 80

Decisiones técnicas

Uso de Alpine para reducir superficie de ataque

Separación build/runtime

No ejecución de Node en producción

☁️ 5. Infraestructura AWS
EC2

Tipo: t2.micro (Free Tier)

IAM Role: AmazonEC2ContainerRegistryReadOnly

Docker Engine instalado

Puertos abiertos:

80 (App)

9090 (Prometheus)

3000 (Grafana)

ECR

Registro privado de imágenes

Versionado por tag

🔐 6. Seguridad – DevSecOps
✔ ESLint

Prevención de errores y malas prácticas.

✔ TypeScript

Validación estática de tipos.

✔ Snyk

Escaneo de dependencias

Escaneo de imagen Docker

✔ SBOM (CycloneDX)

Generado con Syft:

syft <imagen> -o cyclonedx-json


Permite trazabilidad completa de dependencias.

✔ Gestión de secretos

Variables sensibles almacenadas en GitHub Secrets.

✔ IAM Role

Sin credenciales embebidas en EC2.

📊 7. Observabilidad

Stack implementado:

Prometheus

Node Exporter

cAdvisor

Grafana

Métricas monitoreadas
EC2

CPU

Memoria

Disco

Network

Contenedores

Estado

CPU

Memoria

Disco

Red

⚙️ 8. Control de Recursos

El contenedor se ejecuta con:

--memory="256m"
--restart unless-stopped


Justificación:

Protección contra consumo excesivo

Alta disponibilidad básica

📂 9. Entregables Incluidos

.github/workflows/deploy.yml

Dockerfile

Archivos Terraform

sbom-cyclonedx.json

Capturas pipeline exitoso

Capturas dashboards

Evidencia Snyk

README.md

🎯 10. Decisiones Arquitectónicas
Decisión	Justificación
EC2 vs ECS	Control manual para proyecto académico
Docker manual	Comprensión del runtime
SBOM	Cumplimiento supply chain
IAM Role	Seguridad sin credenciales
Multi-stage	Imagen optimizada
Observabilidad completa	Nivel sobresaliente
🧠 11. Defensa Oral – Resumen Técnico

Este proyecto implementa:

CI/CD automatizado

Seguridad integrada en pipeline

Infraestructura reproducible

Monitoreo completo

Gestión segura de credenciales

Supply Chain Security mediante SBOM

Cumple principios de:

DevOps

DevSecOps

Infraestructura como Código

Observabilidad

Automatización

🏆 12. Conclusión

Se desarrolló una arquitectura funcional, automatizada y segura que integra:

Desarrollo moderno

Seguridad integrada

Cloud computing

Contenerización optimizada

Monitoreo avanzado

El proyecto demuestra dominio práctico de herramientas y metodologías del Diplomado DevOps.