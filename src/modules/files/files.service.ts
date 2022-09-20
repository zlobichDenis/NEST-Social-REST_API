import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { PublicFileEntity } from './entities';
import { FileNotFoundException } from './exceptions';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(PublicFileEntity)
        private readonly publicFileRepository: Repository<PublicFileEntity>,
        private readonly configService: ConfigService,
    ) {}

    async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<PublicFileEntity> {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') || '',
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`,
        }).promise();

        const newFile = this.publicFileRepository.create({
            key: uploadResult.Key,
            url: uploadResult.Location,
        });

        await this.publicFileRepository.save(newFile);

        return newFile;
    }

    async deletePublicFile(fileId: number): Promise<void> {
        const file = await this.publicFileRepository.findOneBy({ id: fileId });
        const s3 = new S3();

        if (!file) {
            throw new FileNotFoundException(fileId);
        }

        await s3.deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') || '',
            Key: file.key,
        }).promise();

        await this.publicFileRepository.delete(fileId);
    }
}
