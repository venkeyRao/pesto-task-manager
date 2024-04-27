import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { GlobalModule } from "./global.module";
import { HealthModule } from "./health/health.module";
import { HelmetModule } from "./helmet";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { HttpModule } from "@nestjs/axios";
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    GlobalModule,
    HealthModule,
    HelmetModule.forRoot({
      contentSecurityPolicy: false,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TaskModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
