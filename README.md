# SOCIAL-AUTO: Automatización de Redes Sociales con IA

Este proyecto es una solución técnica avanzada diseñada para desplegarse fácilmente en **Vercel** o Google Cloud. Automatiza la creación y publicación de contenido en múltiples redes sociales (Instagram, LinkedIn, Twitter y **TikTok**).

## 🚀 Despliegue en Vercel
Esta estructura está optimizada para Vercel:
- **Frontend**: Al entrar a tu dominio (`social-auto.vercel.app`), se cargará automáticamente el `index.html` de la raíz.
- **Backend (API)**: Todas las funciones serverless están en la carpeta `/api`. Puedes activarlas llamando a `your-domain.com/api/main`.

## 1. Estructura del Proyecto (Vercel Native)

```text
SOCIAL-AUTO/
├── api/                # Backend (Servicios de IA, Social, DB, etc.)
├── data/               # Repositorio de Ebooks
├── index.html          # Dashboard (Frontend)
├── package.json        # Dependencias del sistema
├── .env                # Configuración privada (No subir a GitHub)
├── .gitignore          # Archivo para proteger tus secretos
└── README.md
```

## 2. Configuración Inicial

1. **Clona el repositorio**.
2. **Configura el entorno**: Crea tu archivo `.env` en la raíz con tus API Keys.
3. **Prepara tu contenido**: Sube tu Ebook a la carpeta `data/`.
4. **Despliegue**: Simplemente conecta tu repo de GitHub a Vercel. Vercel detectará el `index.html` y la carpeta `api/` automáticamente.

## 3. Automatización Cron en Vercel
Para que el sistema publique solo cada día, usa la pestaña de **Cron Jobs** en Vercel y apunta a la ruta `/api/main`.

---
*Desarrollado con arquitectura Antigravity - Vercel Optimized.*
