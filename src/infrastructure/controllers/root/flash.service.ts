import { Injectable, Session } from '@nestjs/common';

@Injectable()
export class FlashService {
  setFlashMessage(@Session() session: Record<string, any>, type: FlashMessageType, message: string) {
    session.flash = { [type]: [message] };
  }

  getFlashMessage(@Session() session: Record<string, any>): Record<string, any> | undefined {
    const flash = session.flash;
    delete session.flash;
    return flash;
  }
}

export enum FlashMessageType {
  SUCCESS = 'success',
  ERROR = 'danger',
  WARNING = 'warning',
  INFO = 'info',
}
