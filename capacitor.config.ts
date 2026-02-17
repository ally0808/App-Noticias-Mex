import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Noticias Mex',
  webDir: 'www',

  plugins: {
    StatusBar: {
      backgroundColor: '#eb445a',
      style: 'DARK',
    },
  },
};

export default config;