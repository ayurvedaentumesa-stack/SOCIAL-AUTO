#!/bin/bash

# Configuration
PROJECT_ID="your-google-cloud-project-id"
REGION="us-central1"
FUNCTION_NAME="social-auto-task"

echo "🚀 Iniciando despliegue de SOCIAL-AUTO..."

# Navegar al directorio del backend
cd ../backend

# Desplegar función en Google Cloud Functions
gcloud functions deploy $FUNCTION_NAME \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region $REGION \
  --project $PROJECT_ID \
  --env-vars-file .env.yaml

echo "✅ Despliegue completado."
echo "Configura Cloud Scheduler para ejecutar esta función cada X horas."
