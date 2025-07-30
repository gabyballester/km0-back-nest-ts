module.exports = {
  // Verificación de seguridad para todos los archivos
  '*': ['node scripts/security-check.js'],

  // Solo procesar archivos TypeScript que NO sean archivos de configuración
  '*.ts': filenames => {
    // Filtrar archivos de configuración
    const configFiles = filenames.filter(
      filename =>
        !filename.includes('.config.ts') &&
        !filename.includes('drizzle.config.ts') &&
        !filename.includes('jest.config.ts') &&
        !filename.includes('commitlint.config.ts'),
    );

    if (configFiles.length === 0) {
      return []; // No hay archivos para procesar
    }

    return [
      `prettier --write ${configFiles.join(' ')}`,
      `eslint --fix --cache --max-warnings=0 ${configFiles.join(' ')}`,
    ];
  },
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
