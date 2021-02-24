import { createConnection, getConnectionOptions } from 'typeorm';

export default async () => {
  const defaultOptions = await getConnectionOptions();

  const isTestEnv = process.env.NODE_ENV === 'test';

  return createConnection(
    Object.assign(defaultOptions, {
      database: isTestEnv ? ':memory:' : defaultOptions.database,
      logging: !isTestEnv,
    }),
  );
};
