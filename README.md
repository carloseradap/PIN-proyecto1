# Proyecto Final Diplomado DevOps - CI/CD Seguro en AWS

## MundosE -- DevOps2502 -- Grupo 8

### Proyecto 1: CI/CD con GitHub Actions + Terraform + Docker (AWS)

![CI/CD](https://github.com/MundosE/PIN-proyecto1/actions/workflows/deploy.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20.x-green)
![Docker](https://img.shields.io/badge/docker-enabled-blue)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20ECR-orange)
![Security](https://img.shields.io/badge/Security-ESLint%20%7C%20Snyk%20%7C%20SBOM-success)
![License](https://img.shields.io/badge/Status-Academic%20Project-blueviolet)

------------------------------------------------------------------------

## 1. Introducción

Este proyecto implementa un pipeline completo de Integración y Entrega
Continua (CI/CD) para una aplicación SPA desarrollada con React +
TypeScript + Vite, desplegada en AWS utilizando infraestructura como
código y prácticas de DevSecOps.

Se integran los siguientes componentes:

-   Contenerización con Docker
-   Infraestructura como Código con Terraform
-   Pipeline automatizado con GitHub Actions
-   Publicación de imagen en Amazon ECR
-   Despliegue automatizado en EC2 (Free Tier)
-   Generación de SBOM (CycloneDX / SPDX)
-   Análisis de seguridad (ESLint + Snyk)
-   Observabilidad con Prometheus + Grafana

------------------------------------------------------------------------

## 2. Arquitectura General

### Stack Tecnológico

-   React
-   TypeScript
-   Vite
-   Docker
-   Nginx (servidor estático)
-   AWS EC2 (t2.micro -- Free Tier)
-   Amazon ECR
-   Terraform
-   GitHub Actions
-   Prometheus
-   Node Exporter
-   cAdvisor
-   Grafana

### Flujo de Arquitectura

GitHub → GitHub Actions → Amazon ECR → EC2 (Docker)\
EC2 → Prometheus → Grafana

------------------------------------------------------------------------

## 3. Aplicación

Aplicación SPA construida con:

-   React
-   TypeScript
-   Vite

Estructura principal:

src/ ├── main.tsx ├── App.tsx ├── config.ts └── index.css

Build de producción generado en:

/dist

------------------------------------------------------------------------

## 4. Contenerización

Archivo:

Dockerfile

### Estrategia Multi-Stage

1.  Stage 1 -- Node: build de la aplicación
2.  Stage 2 -- Nginx: servidor estático para producción

Imagen publicada en:

627131317824.dkr.ecr.us-east-1.amazonaws.com/pin-proyecto1-repo:latest

------------------------------------------------------------------------

## 5. Infraestructura como Código (Terraform)

La infraestructura se define en la carpeta:

infra/

Incluye:

-   VPC
-   Subnet pública
-   Internet Gateway
-   Security Group
-   EC2 Instance
-   IAM Role (AmazonEC2ContainerRegistryReadOnly)
-   ECR Repository

------------------------------------------------------------------------

## 6. Pipeline CI/CD

Definido en:

.github/workflows/deploy.yml

Etapas:

1.  Checkout
2.  npm ci
3.  Typecheck
4.  ESLint
5.  Build Docker
6.  SBOM
7.  Push a ECR
8.  Deploy en EC2

------------------------------------------------------------------------

## 7. DevSecOps & Seguridad Implementada

Este proyecto integra prácticas de seguridad en cada etapa del pipeline CI/CD:

### 1️⃣ Análisis Estático de Código
- ESLint v9 (Flat Config)
- Validación automática en GitHub Actions
- El pipeline falla ante errores críticos

### 2️⃣ Análisis de Dependencias
- Snyk Scan en pipeline
- Evaluación de vulnerabilidades NPM
- Política: fail on high severity

### 3️⃣ Seguridad de Imagen Docker
- Imagen base mínima (Node Alpine + Nginx)
- Multi-stage build
- Reducción de superficie de ataque

### 4️⃣ SBOM (Software Bill of Materials)
- Generado con Syft
- Formato CycloneDX JSON
- Evidencia almacenada como artefacto del pipeline

### 5️⃣ Seguridad en Infraestructura
- IAM Role para EC2 (sin credenciales hardcodeadas)
- Policy AmazonEC2ContainerRegistryReadOnly
- SSH mediante clave privada
- Variables sensibles almacenadas en GitHub Secrets

Este enfoque cumple principios de:

- DevSecOps
- Secure Software Supply Chain
- Least Privilege
- Shift Left Security


------------------------------------------------------------------------

## 8. Observabilidad

Stack implementado:

-   Prometheus
-   Node Exporter
-   cAdvisor
-   Grafana

Métricas:

EC2: - CPU - Memoria - Disco - Red

Contenedores: - CPU - Memoria - Disco - Red - Estado

------------------------------------------------------------------------

## 9. Conclusión

El proyecto demuestra la integración completa de CI/CD, IaC, seguridad y
observabilidad en AWS Free Tier.

Incluye:

Snyk Scan

SBOM generation

Upload artifacts

Memory limit en Docker

restart policy

Autor: Grupo 7 -- MundosE\
Diplomado DevOps 2502\
Año 2026
