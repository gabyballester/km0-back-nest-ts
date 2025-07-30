# Script de PowerShell para eliminar credenciales del historial de Git
Write-Host "Eliminando credenciales del historial de Git..."

# Reemplazar las credenciales reales con placeholders
git filter-branch --force --index-filter '
    git ls-files | ForEach-Object {
        $content = Get-Content $_ -Raw
        $content = $content -replace "postgresql://gabi:JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA@dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com/km0_db", "postgresql://user:password@host:port/km0_db?sslmode=require"
        $content = $content -replace "JrqKcqtJtm8KgeMJ0xzVDCn5FIv3rDWA", "REPLACED_PASSWORD"
        $content = $content -replace "dpg-d21b6hmmcj7s73c4atcg-a.oregon-postgres.render.com", "REPLACED_HOST"
        Set-Content $_ -Value $content -NoNewline
    }
' --prune-empty --tag-name-filter cat -- --all

Write-Host "Limpieza completada. Ejecutando garbage collection..."

# Limpiar el repositorio
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Credenciales eliminadas del historial de Git."
