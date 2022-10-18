import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'it is working for signup' };
  }

  signin() {
    return { msg: 'It is working for signin' };
  }
}
