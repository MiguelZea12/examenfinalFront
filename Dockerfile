# Imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY . .

# Instalar dependencias y construir el frontend
RUN npm install && npm run build

# Servir la aplicación con un servidor web
RUN npm install -g serve

# Exponer el puerto de Vite (si es desarrollo) o del servidor web
EXPOSE 4173

# Comando de inicio
CMD ["serve", "-s", "dist"]
