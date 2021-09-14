import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://storeadmin:storeadmin123@tarinicluster0.mnxhs.mongodb.net/autostore?retryWrites=true&w=majority'),
  },
];