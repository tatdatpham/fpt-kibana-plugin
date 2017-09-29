import { resolve } from 'path';
import exampleRoute from './server/routes/example';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'fpt-plugin',
    uiExports: {

      app: {
        title: 'FPT SIEM',
        description: 'FPT Kibana Plugin',
        main: 'plugins/malice/app',
        icon: 'plugins/malice/icon.svg'
      },


      translations: [
        resolve(__dirname, './translations/es.json')
      ],


      hacks: [
        'plugins/malice/hack'
      ]

    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },


    init(server, options) {
      server.log(['status', 'info', 'fpt-plugin'], 'FPT plugin Initializing...');
      // Add server routes and initalize the plugin here
      exampleRoute(server);
    }


  });
}
