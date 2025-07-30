#!/bin/bash

# Script para eliminar credenciales del historial de Git
echo "Eliminando credenciales del historial de Git..."

# Reemplazar las credenciales reales con placeholders
git filter-branch --force --index-filter '
    git ls-files -z | xargs -0 sed -i "s/postgresql:\/\/gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com\/km0_db/postgresql:\/\/user:password@host:port\/km0_db?sslmode=require/g"
    git ls-files -z | xargs -0 sed -i "s/JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA/REPLACED_PASSWORD/g"
    git ls-files -z | xargs -0 sed -i "s/dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/REPLACED_HOST/g"
' --prune-empty --tag-name-filter cat -- --all

echo "Limpieza completada. Ejecutando garbage collection..."

# Limpiar el repositorio
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "Credenciales eliminadas del historial de Git."
