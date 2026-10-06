import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  // El sufijo `!` marca archivos de producción: `knip --production` ignora tests y
  // detecta código que solo usan los tests.
  project: ['src/**/*.{ts,tsx,css,svg}!', '!src/test/**!'],
  // Compilador vacío para que knip incluya los SVG y reporte íconos que nadie importa.
  compilers: { svg: () => '' },
}

export default config
