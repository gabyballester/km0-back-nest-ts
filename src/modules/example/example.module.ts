import { Module } from '@nestjs/common';
import { ExampleController } from '@/modules/example/example.controller';

/**
 * Módulo de ejemplo para demostrar el versionado de la API
 *
 * Este módulo contiene endpoints de ejemplo que muestran cómo
 * estructurar correctamente una API versionada.
 */
@Module({
  controllers: [ExampleController],
})
export class ExampleModule {}
