import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";

export const FileValidationRules = [
  new MaxFileSizeValidator({ maxSize: 10485760 }),
  new FileTypeValidator({
    fileType: /(jpg|jpeg|png|pdf|docx|doc)$/,
  }),
];

export class UploadFilePipe extends ParseFilePipe {}
