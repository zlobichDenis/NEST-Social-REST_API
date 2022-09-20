import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { PrivateFileEntity } from './entities';
import { FileNotFoundException, ForbiddenDeleteException } from '../files/exceptions';

@Injectable()
export class PrivateFilesService {
    constructor(
        @InjectRepository(PrivateFileEntity)
        private readonly privateFilesRepository: Repository<PrivateFileEntity>,
        private readonly configService: ConfigService,
    ) {}

    async uploadPrivateFile(dataBuffer: Buffer, ownerId: number, filename: string): Promise<PrivateFileEntity> {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME') || '',
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`,
        }).promise();

        const newFile = this.privateFilesRepository.create({
            key: uploadResult.Key,
            owner: {
                id: ownerId,
            },
        });

        await this.privateFilesRepository.save(newFile);

        return newFile;
    }

    async deletePrivateFile(fileId: number, userId: number): Promise<void> {
        const file = await this.privateFilesRepository.findOneBy({ id: fileId });
        const s3 = new S3();

        if (!file) {
            throw new FileNotFoundException(fileId);
        }

        if (file.owner.id !== userId) {
            throw new ForbiddenDeleteException(fileId);
        }

        await s3.deleteObject({
            Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME') || '',
            Key: file.key,
        }).promise()

        await this.privateFilesRepository.delete(fileId);
    }
}
