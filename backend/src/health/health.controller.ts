import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from "@nestjs/terminus";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health check")
@Controller("health")
export class HealthController {
  constructor(private health: HealthCheckService, private http: HttpHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck("nestjs-docs", "https://docs.nestjs.com")]);
  }
}
