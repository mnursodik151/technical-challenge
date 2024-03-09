import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dto/user.profile.dto';
import { ChineseZodiac } from 'src/enums/zodiac.enum';
import { Horoscope } from 'src/enums/horoscope.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async verifyPassword(user: User, plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, user.password);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }).exec();

    const result = user.toObject();
    if (!result.about)
      result.about = undefined

    return result
  }

  async createOrupdateProfile(usernameOrEmail: string, dto: UserProfileDto): Promise<UpdateWriteOpResult> {
    let updatePayload
    const user = await this.findOneByUsernameOrEmail(usernameOrEmail)
    if (!user)
      throw new NotFoundException

    if(dto.birthday)
    {
      const horoscopeAndZodiac = await this.calculateZodiacAndHoroscope(dto.birthday)
      updatePayload = { ...horoscopeAndZodiac }
    }

    updatePayload = {...user.about, ...updatePayload, ...dto}
    return this.userModel.updateOne({ username: user.username }, { interests: dto.interests ,about: updatePayload }).exec()
  }

  async calculateZodiacAndHoroscope(birthday: Date): Promise<{ horoscope: Horoscope, zodiac: ChineseZodiac }> {
    const year = birthday.getFullYear() + 9;
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();

    let horoscope: Horoscope;
    let zodiac: ChineseZodiac;

    switch (month) {
      case 1:
        horoscope = day <= 19 ? Horoscope.Capricorn : Horoscope.Aquarius;
        break;
      case 2:
        horoscope = day <= 18 ? Horoscope.Aquarius : Horoscope.Pisces;
        break;
      case 3:
        horoscope = day <= 20 ? Horoscope.Pisces : Horoscope.Aries;
        break;
      case 4:
        horoscope = day <= 19 ? Horoscope.Aries : Horoscope.Taurus;
        break;
      case 5:
        horoscope = day <= 20 ? Horoscope.Taurus : Horoscope.Gemini;
        break;
      case 6:
        horoscope = day <= 21 ? Horoscope.Gemini : Horoscope.Cancer;
        break;
      case 7:
        horoscope = day <= 22 ? Horoscope.Cancer : Horoscope.Leo;
        break;
      case 8:
        horoscope = day <= 22 ? Horoscope.Leo : Horoscope.Virgo;
        break;
      case 9:
        horoscope = day <= 22 ? Horoscope.Virgo : Horoscope.Libra;
        break;
      case 10:
        horoscope = day <= 23 ? Horoscope.Libra : Horoscope.Scorpio;
        break;
      case 11:
        horoscope = day <= 21 ? Horoscope.Scorpio : Horoscope.Sagittarius;
        break;
      case 12:
        horoscope = day <= 21 ? Horoscope.Sagittarius : Horoscope.Capricorn;
        break;
      default:
        throw new Error('Invalid month');
    }

    switch (year % 12) {
      case 0:
        zodiac = ChineseZodiac.Pig;
        break;
      case 1:
        zodiac = ChineseZodiac.Rat;
        break;
      case 2:
        zodiac = ChineseZodiac.Ox;
        break;
      case 3:
        zodiac = ChineseZodiac.Tiger;
        break;
      case 4:
        zodiac = ChineseZodiac.Rabbit;
        break;
      case 5:
        zodiac = ChineseZodiac.Dragon;
        break;
      case 6:
        zodiac = ChineseZodiac.Snake;
        break;
      case 7:
        zodiac = ChineseZodiac.Horse;
        break;
      case 8:
        zodiac = ChineseZodiac.Sheep;
        break;
      case 9:
        zodiac = ChineseZodiac.Monkey;
        break;
      case 10:
        zodiac = ChineseZodiac.Rooster;
        break;
      case 11:
        zodiac = ChineseZodiac.Dog;
        break;
    }
    return { horoscope, zodiac }
  }
}
