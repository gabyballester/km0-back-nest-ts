const { register } = require('tsconfig-paths');
const path = require('path');

// Configurar paths para producción
register({
  baseUrl: path.resolve(__dirname, 'dist'),
  paths: {
    '@/*': ['*'],
    '@/config/*': ['config/*'],
    '@/shared/*': ['shared/*'],
    '@/modules/*': ['modules/*'],
    '@/infrastructure/*': ['infrastructure/*'],
    '@/health/*': ['health/*'],
  },
});
