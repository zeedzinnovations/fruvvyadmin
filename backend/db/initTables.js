import pool from "./db.js";

export const initTables = async () => {
  try {
//otp store table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otp_store (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_otp_phone
      ON otp_store(phone_number);
    `);

  //refresh tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(15) NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_refresh_token UNIQUE (token_hash)
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_phone
      ON refresh_tokens(phone_number);
    `);

//categories table 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

  //product table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category_id INT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        country VARCHAR(100),
        unit VARCHAR(50),
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_category
          FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON DELETE CASCADE
      );
    `);

    console.log(" All tables created ");
  } catch (error) {
    console.error("Table creation failed:", error.message);
    process.exit(1);
  }
};
