#!/bin/bash

echo "🧹 Limpiando credenciales del historial de Git..."

# Crear un script temporal para el filtro
cat > /tmp/clean_script.sh << 'EOF'
#!/bin/bash
# Script temporal para limpiar credenciales

# Reemplazar las credenciales específicas
find . -type f -name "*.md" -exec sed -i 's|postgresql://gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db|postgresql://user:password@host:port/km0_db?sslmode=require|g' {} \;
find . -type f -name "*.yml" -exec sed -i 's|postgresql://gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db|postgresql://user:password@host:port/km0_db?sslmode=require|g' {} \;
find . -type f -name "*.yaml" -exec sed -i 's|postgresql://gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db|postgresql://user:password@host:port/km0_db?sslmode=require|g' {} \;

# Reemplazar la contraseña específica
find . -type f -name "*.md" -exec sed -i 's|JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA|REPLACED_PASSWORD|g' {} \;
find . -type f -name "*.yml" -exec sed -i 's|JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA|REPLACED_PASSWORD|g' {} \;
find . -type f -name "*.yaml" -exec sed -i 's|JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA|REPLACED_PASSWORD|g' {} \;

# Reemplazar el host específico
find . -type f -name "*.md" -exec sed -i 's|dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com|REPLACED_HOST|g' {} \;
find . -type f -name "*.yml" -exec sed -i 's|dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com|REPLACED_HOST|g' {} \;
find . -type f -name "*.yaml" -exec sed -i 's|dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com|REPLACED_HOST|g' {} \;
EOF

chmod +x /tmp/clean_script.sh

# Ejecutar git filter-branch con el script
git filter-branch --force --index-filter '/tmp/clean_script.sh' --prune-empty --tag-name-filter cat -- --all

# Limpiar
rm /tmp/clean_script.sh

echo "🧹 Limpieza completada. Ejecutando garbage collection..."

# Limpiar el repositorio
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Credenciales eliminadas del historial de Git."
