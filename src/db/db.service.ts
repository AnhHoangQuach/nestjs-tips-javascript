import { Inject, Injectable } from '@nestjs/common';
import { DbModuleOptions } from './db.module';
import { access, readFile, writeFile } from 'fs/promises';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private readonly options: DbModuleOptions;

  async read() {
    const filePath = this.options.path;
    try {
      await access(filePath);
      const data = await readFile(filePath, {
        encoding: 'utf8',
      });

      const parsed = JSON.parse(data) as User[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error reading file:', err);
      return [];
    }
  }

  async write(obj: Record<string, any>) {
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf8',
    });
  }
}
