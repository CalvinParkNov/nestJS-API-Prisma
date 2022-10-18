import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    //generate the password has
    const hash = await argon.hash(dto.password);
    try {
      //save the new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hash },
      });

      delete user.password;

      //return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by eamil
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception

    if (!user) {
      throw new ForbiddenException('credentials incorrect');
    }

    //else if user exist compare password

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('credentials incorrect');
    }
    //if password incorrect throw exception

    // if everything is all good
    // send back the user
    delete user.password;
    return user;
  }
}
