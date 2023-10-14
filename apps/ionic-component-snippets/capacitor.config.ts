import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-component-snippets',
  webDir: '../../dist/apps/ionic-component-snippets',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
