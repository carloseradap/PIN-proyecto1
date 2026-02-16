# Proyecto 1 - CI/CD con GitHub Actions + Terraform + Docker (AWS)

Repositorio: MundosE/PIN-proyecto1  
Stack: React + TypeScript + Vite  
Infraestructura: AWS  
CI/CD: GitHub Actions  

## Aplicación

Aplicación SPA construida con:
- React
- TypeScript
- Vite

Build de producción generado en carpeta `/dist`.

## Scripts disponibles

- npm run dev → entorno de desarrollo
- npm run build → build producción
- npm run preview → preview build
- npm run typecheck → validación TypeScript
- npm run lint → análisis ESLint

### ESLint Configuration

Se utiliza ESLint v9 con Flat Config.
Plugins:
- @eslint/js
- typescript-eslint
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

El análisis falla el pipeline si existen errores.

ESLint está configurado para ignorar la carpeta `dist/` ya que contiene código compilado y minificado generado por Vite.

## Validación local previa a CI

Antes de ejecutar el pipeline:

npm ci
npm run typecheck
npm run lint
npm run build

## Validacion Error WSL + Docker Desktop

En WSL2 con Docker Desktop, el archivo:

~/.docker/config.json

puede incluir:

"credsStore": "desktop"

Eso fuerza el uso de un binario Windows (docker-credential-desktop.exe)
que no puede ejecutarse en entorno Linux.

La solución es eliminar esa configuración para permitir autenticación estándar.

## Key Pair AWS

Antes de ejecutar Terraform es necesario crear un Key Pair en:

AWS Console → EC2 → Key Pairs

Nombre recomendado:

pin-proyecto1-key

El archivo .pem debe almacenarse de forma segura y con permisos 400.

## IAM Role para EC2

La instancia EC2 utiliza un IAM Role con la policy:

AmazonEC2ContainerRegistryReadOnly

Esto permite que la instancia haga pull de imágenes desde ECR
sin necesidad de almacenar credenciales manualmente.

## Despliegue en AWS

La instancia EC2 utiliza un IAM Role con la policy:

AmazonEC2ContainerRegistryReadOnly

Esto permite autenticación automática contra ECR sin almacenar credenciales manualmente.

Flujo de despliegue:

1. Build Docker local
2. Push a ECR
3. EC2 hace pull usando IAM Role
4. Ejecuta contenedor en puerto 80

URL pública:
http://54.221.4.144

## Estrategia de Deploy

El contenedor se ejecuta con nombre fijo:

pin-proyecto1

Para actualizar la aplicación:

1. docker stop pin-proyecto1
2. docker rm pin-proyecto1
3. docker pull <ECR_IMAGE>
4. docker run -d --name pin-proyecto1 -p 80:80 <ECR_IMAGE>

## Autenticación Git

El repositorio utiliza autenticación SSH para evitar el uso de
credenciales HTTPS y tokens personales.

## Observabilidad – Prometheus & Grafana

Para cumplir con el requisito de monitoreo del Proyecto 1, se desplegaron:

- Prometheus (puerto 9090)
- Grafana (puerto 3000)

Ambos ejecutándose como contenedores Docker dentro de la misma instancia EC2 (Free Tier).

Acceso:

- Prometheus: http://<EC2_PUBLIC_IP>:9090
- Grafana: http://<EC2_PUBLIC_IP>:3000

Credenciales iniciales Grafana:
- Usuario: admin
- Password: admin

Grafana utiliza Prometheus como datasource para visualizar métricas básicas del entorno.

Este componente cubre el requisito de Observabilidad del Proyecto 1.

## Application Architecture

This project deploys a React + TypeScript + Vite SPA (Nova Flow Mini).

### Tech Stack
- React
- TypeScript
- Vite
- Docker (multi-stage)
- Nginx (static serving)
- AWS EC2 (Free Tier)
- AWS ECR
- Terraform (IaC)
- GitHub Actions (CI/CD)

### Application Structure

src/
main.tsx
App.tsx
config.ts
index.css


### Build Process

1. Vite builds static assets into `/dist`
2. Docker multi-stage:
   - Stage 1: Node builds app
   - Stage 2: Nginx serves static files
3. Image pushed to ECR
4. EC2 pulls latest image and runs container

### Deployment Model

- Single EC2 instance (t2.micro – Free Tier)
- Single Docker container
- Port 80 exposed
- Security Group allows HTTP (80)

