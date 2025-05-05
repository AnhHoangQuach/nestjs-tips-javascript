import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { storage } from './oss';
import { UserService } from './user.service';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('merge/file')
  mergeFile(@Query('file') fileName: string, @Res() res: Response) {
    const nameDir = 'uploads/' + fileName;

    const files = fs.readdirSync(nameDir);

    let startPos = 0,
      countFile = 0;
    files.map((file) => {
      const filePath = nameDir + '/' + file;
      const streamFile = fs.createReadStream(filePath);
      streamFile.pipe(
        fs
          .createWriteStream('uploads/merge/' + fileName, {
            start: startPos,
          })
          .on('finish', () => {
            countFile++;
            if (files.length === countFile) {
              fs.rm(
                nameDir,
                {
                  recursive: true,
                },
                () => {},
              );
            }
          }),
      );

      startPos += fs.statSync(filePath).size;
    });

    return res.json({
      link: `http://localhost:3000/uploads/merge/${fileName}`,
      fileName,
    });
  }

  @Post('upload/large-file')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadLargeFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { name: string },
  ) {
    const fileName = body.name.match(/(.+)-\d+$/)?.[1] ?? body.name;
    const nameDir = 'uploads/chunks-' + fileName;

    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir);
    }

    fs.cpSync(files[0].path, nameDir + '/' + body.name);

    fs.rmSync(files[0].path);
  }

  @Post('upload/avt')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/avatar',
      storage,
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter(req, file, cb) {
        const extName = path.extname(file.originalname);
        if (['.jpg', '.png', '.gif'].includes(extName)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Upload file error'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('upload file ->>>', file.path);
    return file.path;
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('new')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
