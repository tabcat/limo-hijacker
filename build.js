import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['limo-hijacker.js'],
  bundle: true,
  outfile: 'limo-hijacker.bundle.js',
  platform: 'browser',
  format: 'esm',
  target: ['chrome125'],
  minify: false,
  define: {
    global: 'window',  // Replace global with window
  }
}).catch(() => process.exit(1));
