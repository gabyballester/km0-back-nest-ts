#!/bin/bash

echo "🔍 Buscando y eliminando la contraseña específica de todos los commits..."

# Crear un script temporal para el filtro
cat > /tmp/remove_password.sh << 'EOF'
#!/bin/bash
# Script temporal para eliminar la contraseña específica

# Reemplazar la contraseña específica en todos los archivos
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.ts" -o -name "*.js" -o -name "*.json" \) -exec sed -i 's|JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA|REPLACED_PASSWORD|g' {} \;

# Reemplazar la URL completa de la base de datos
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.ts" -o -name "*.js" -o -name "*.json" \) -exec sed -i 's|postgresql://gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db|postgresql://user:password@host:port/km0_db?sslmode=require|g' {} \;

# Reemplazar el host específico
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.ts" -o -name "*.js" -o -name "*.json" \) -exec sed -i 's|dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com|REPLACED_HOST|g' {} \;
EOF

chmod +x /tmp/remove_password.sh

# Ejecutar git filter-branch con el script
git filter-branch --force --index-filter '/tmp/remove_password.sh' --prune-empty --tag-name-filter cat -- --all

# Limpiar
rm /tmp/remove_password.sh

echo "🧹 Limpieza completada. Ejecutando garbage collection..."

# Limpiar el repositorio
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Contraseña eliminada de todos los commits."
