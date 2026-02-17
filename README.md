# Proyecto Final Diplomado DevOps

## MundosE -- DevOps2502 -- Grupo 7

### Proyecto 1: CI/CD con GitHub Actions + Terraform + Docker (AWS)

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

## 7. Seguridad

### ESLint

Análisis estático integrado al pipeline.

### Snyk

Escaneo de dependencias e imagen Docker.

### SBOM

Generado con Syft en formato CycloneDX y SPDX.

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

Autor: Grupo 7 -- MundosE\
Diplomado DevOps 2502\
Año 2026
