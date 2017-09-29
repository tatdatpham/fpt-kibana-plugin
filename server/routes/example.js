export default function (server) {

  server.route({
    path: '/api/fpt/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
