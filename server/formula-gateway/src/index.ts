import Fastify from 'fastify';

const app = Fastify({ logger: true });

const supportedConnectors = [
  'barrett-universal-ii',
  'barrett-toric',
  'kane',
  'evo',
  'pearl-dgs',
  'hill-rbf',
  'cooke-k6',
  'hoffer-qst'
];

app.get('/health', async () => ({ ok: true, service: 'iolpro-formula-gateway' }));

app.post('/api/formulas/:formulaId', async (request, reply) => {
  const { formulaId } = request.params as { formulaId: string };
  if (!supportedConnectors.includes(formulaId)) {
    return reply.code(404).send({ supported: false, message: 'Unknown formula connector.' });
  }

  return reply.code(501).send({
    supported: false,
    formulaId,
    message: 'Connector contract is ready, but no authorized implementation/API credentials are configured.',
    requiredAction: 'Implement this route only after obtaining formula permission/API access and completing validation.'
  });
});

const port = Number(process.env.PORT ?? 8787);
app.listen({ port, host: '0.0.0.0' });
