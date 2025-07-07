import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Handle new user registration
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User already exists! Please try with a different email.',
      );
    }

    // Ensure password is a string before hashing
    const safePassword = String(password);

    // Hash the password
    const hashedPassword = await bcrypt.hash(safePassword, 10);

    // Create new user in database
    const newlyCreatedUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Exclude password before returning
    const { password: _, ...result } = newlyCreatedUser;
    return result;
  }

  // Handle user login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials! Please try again.');
    }

    // Compare password safely
    const isPasswordValid = await bcrypt.compare(String(password), user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials! Please try again.');
    }

    // Sign JWT token
    const token = this.jwtService.sign({ userId: user.id });

    // Exclude password before returning
    const { password: _, ...result } = user;

    return { ...result, token };
  }
}
