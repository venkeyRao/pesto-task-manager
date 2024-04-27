import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { MongoPrismaService } from "./prisma/mongo-prisma.service";
import { ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";
import * as fs from "fs";

async function bootstrap() {
  const isDevEnv = process.env.BASE_MODE === "dev";
  const httpsOptions = {
    key: isDevEnv ? fs.readFileSync(process.env.SSL_KEY_PATH) : "",
    cert: isDevEnv ? fs.readFileSync(process.env.SSL_CERT_PATH) : "",
  };
  const app = isDevEnv
    ? await NestFactory.create(AppModule, { httpsOptions, rawBody: true })
    : await NestFactory.create(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);
  const mongoPrismaService = app.get(MongoPrismaService);
  const baseUrl = configService.get<string>("APP_URL", "https://localhost:5173")?.split(",") || [];
  const baseMode = configService.get<string>("BASE_MODE");

  app.enableCors({
    origin:
      baseMode === "dev" || baseMode === "stg"
        ? [`https://localhost:5173`, `https://127.0.0.1:5173`, `https://0.0.0.0:5173`, ...baseUrl]
        : baseUrl,
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await mongoPrismaService.enableShutdownHooks(app);

  const config = new DocumentBuilder()
    .addApiKey({ type: "apiKey", name: "X-API-KEY", in: "header" }, "X-API-KEY")
    .addBearerAuth()
    .setTitle("PESTO BE API")
    .setDescription("You can find documentation for all endpoints on PESTO BE website.")
    .setVersion("0.0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3333);

  await app.listen(port, host, () => {
    console.info(`PESTO BE API server is running on http://${host}:${port}`);
  });
}
bootstrap();
