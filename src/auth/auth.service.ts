import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return { msg: 'it is working for signup' };
  }

  signin() {
    return { msg: 'It is working for signin' };
  }
}
