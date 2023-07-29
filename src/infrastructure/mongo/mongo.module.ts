import { Module } from '@nestjs/common';

import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { EnvironmentConfigModule } from '../config/environment/environment-config.module';
import { EnvironmentConfigService } from '../config/environment/environment-config.service';

export const getMongooseModuleOptions = (config: EnvironmentConfigService): MongooseModuleFactoryOptions => ({
  uri: config.getMongoDbUri(),
});

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getMongooseModuleOptions,
    }),
  ],
})
export class MongoConfigModule {}
