import { Controller, Post, Get, Body, Inject, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * redis
   */
  @Inject(RedisService)
  private redisService: RedisService;

  /**
   * 邮箱
   */
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  /**
   * 注册
   * @param registerUser 
   * @returns 
   */
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {

    console.log(registerUser);

    return await this.userService.register(registerUser);
  }


  /**
   * 发送验证码
   * @param address 
   * @returns 
   */
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {

    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`
    });

    return '发送成功';

  }


  /**
   * 初始化数据
   */
  @Get("init-data")
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);

    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    },{
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    })


    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    },{
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    })

    return vo;

  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);

    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    },{
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    })


    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    },{
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    })


    return vo;
  }

}
