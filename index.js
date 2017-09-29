import { resolve } from 'path';
import exampleRoute from './server/routes/example';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'fpt',
    uiExports: {

      app: {
        title: 'FPT SIEM',
        description: 'FPT Kibana Plugin',
        main: 'plugins/fpt/app',
        icon: 'plugins/fpt/icon.svg'
      },


      translations: [
        resolve(__dirname, './translations/es.json')
      ],


      hacks: [
        'plugins/fpt/hack'
      ]

    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },


    init(server, options) {
      server.log(['status', 'info', 'fpt'], 'FPT plugin Initializing...');
      // Add server routes and initalize the plugin here
      exampleRoute(server);
    }


  });
}
