import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['limo-hijacker.js'],
  bundle: true,
  outfile: 'limo-hijacker.bundle.js',
  platform: 'browser',
  format: 'iife',
  target: ['chrome125'],
  minify: false,
  define: {
    global: 'window',  // Replace global with window
  }
}).catch(() => process.exit(1));

