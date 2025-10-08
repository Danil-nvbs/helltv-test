import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');
    const existingUser: Record<string, any>[] = await dataSource.query(
      'SELECT * FROM users WHERE id = 1',
    );

    if (existingUser.length === 0) {
      await dataSource.query(`
        INSERT INTO users (id, balance, created_at, updated_at)
        VALUES (1, 1000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      console.log('✅ User with id=1 created with initial balance of $1000');

      // Добавляем начальную запись в историю
      await dataSource.query(`
        INSERT INTO balance_history (user_id, action, amount, description, ts)
        VALUES (1, 'credit', 1000.00, 'Initial balance', CURRENT_TIMESTAMP)
      `);
      console.log('✅ Initial balance history record created');
    } else {
      console.log('ℹ️  User with id=1 already exists');
    }

    await dataSource.destroy();
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
