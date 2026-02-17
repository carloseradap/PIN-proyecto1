📌 Project: DevOps CI/CD + Containerized Deployment + Observability on AWS EC2
📖 Overview

This project demonstrates the implementation of a complete DevOps pipeline including:

CI/CD with GitHub Actions

Dockerized application deployment

Deployment to AWS EC2

Container security scanning

SBOM generation (CycloneDX & SPDX)

Monitoring with Prometheus, cAdvisor and Node Exporter

Visualization with Grafana

Container and EC2 observability dashboards

🏗 Architecture

The solution architecture consists of:

AWS EC2 instance (Amazon Linux 2023)

Docker containers:

Application container

Prometheus

Grafana

Node Exporter

cAdvisor

GitHub Actions pipeline for CI/CD

Amazon ECR for container registry

🚀 CI/CD Pipeline

The pipeline is implemented using GitHub Actions:

📁 .github/workflows/deploy.yml

Pipeline stages:

Checkout source code

Install dependencies

Run lint (ESLint)

Security scan (Snyk)

Build Docker image

Generate SBOM (CycloneDX / SPDX)

Push image to Amazon ECR

Deploy to EC2

🐳 Docker

Dockerfile located at:

docker/Dockerfile


Build command:

docker build -t app-image .


Push to ECR:

docker tag app-image:latest <ECR_URI>
docker push <ECR_URI>


Export artifact (optional deliverable):

docker save app-image:latest -o app-image.tar

📦 SBOM Generation
CycloneDX
docker sbom app-image:latest -o cyclonedx-json > sbom-cyclonedx.json

SPDX
docker sbom app-image:latest -o spdx-json > sbom-spdx.json

🔐 Security Scanning
ESLint
npx eslint . -f json -o eslint-report.json

Snyk
snyk test --json > snyk-report.json

SonarQube (Optional)

Static code analysis performed through SonarQube server.

📊 Monitoring Stack
Prometheus

Scrapes:

Node Exporter

cAdvisor

Application metrics

Grafana Dashboards

Implemented dashboards:

EC2 CPU Usage

EC2 Memory Usage

EC2 Disk Usage

Container CPU

Container Memory

Container Network

Container Disk

Application Status

📈 Key Metrics
EC2

CPU utilization

Memory usage

Disk usage (root filesystem)

Containers

CPU per container

Memory per container

Disk usage per container

Network RX/TX per container

Container UP/DOWN status

🔐 Security Practices Implemented

SBOM generation

Vulnerability scanning

Static code analysis

Image scanning

Container isolation

Non-root execution (if implemented)

📦 Deliverables

GitHub Actions Workflow

Dockerfile

Docker image artifact (.tar)

SBOM (CycloneDX + SPDX)

Security scan reports

Monitoring configuration

Dashboards JSON export

🧠 Skills Demonstrated

DevOps Engineering

CI/CD

Containerization

AWS Deployment

Observability

Security & Compliance

Infrastructure Monitoring