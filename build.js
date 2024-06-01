import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/background.js'],
  bundle: true,
  outfile: 'extension/background.js',
  platform: 'browser',
  format: 'iife',
  target: ['chrome125'],
  minify: false,
  define: {
    global: 'window',  // Replace global with window
  }
}).catch(() => process.exit(1));

