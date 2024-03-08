import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';


export class UnLoginException {
  message: string;

  constructor(message?) {
    this.message = message;
  }
}
/**
 * 自定义了 UnLoginException 的异常，在 @Catch 指定捕获这个异常，返回对应的响应。
 */
@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {

    const response = host.switchToHttp().getResponse<Response>();
    
    response.json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: exception.message || '用户未登录'
    }).end();


  }
}


