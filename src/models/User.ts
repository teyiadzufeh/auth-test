import { Pool } from 'pg';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export class UserModel {
  constructor(private readonly pool: Pool) {}

  async create(data: CreateUserData): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const result = await this.pool.query(
      `INSERT INTO users (email, password, name, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, name, created_at, updated_at`,
      [data.email, hashedPassword, data.name]
    );

    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const result = await this.pool.query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}