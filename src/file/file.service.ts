import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { TFileResponse } from 'src/libs/entities/types/cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class FileService {
  uploadFile(file: Express.Multer.File): Promise<TFileResponse> {
    return new Promise<TFileResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          if (result.url) {
            resolve({ message: 'Success', url: result.url });
          } else {
            resolve({ message: 'Failed to upload file' });
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
