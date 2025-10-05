import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';


export default defineConfig((configEnv) => {
   return {
    ...(configEnv.mode === 'development' && {
      server: {
        host: 'app-local.wails-awesome.io',
        port: 3000,
        // headers: {
        //   'content-security-policy': "default-src wails://localhost 'self'; connect-src wails://localhost 'self'; script-src 'self' 'unsafe-inline'"
        // },
        https: {
          cert: fs.readFileSync(path.resolve(__dirname, './ssl/server.pem')),
          key: fs.readFileSync(
            path.resolve(__dirname, './ssl/_wildcard.wails-awesome.io+2-key.pem')
          )
        },
      }
      })
    }
});
