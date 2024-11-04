const pool = require("./connection");

const createTable = async () => {
    const query = `
        -- Create the required extensions
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        DROP TRIGGER IF EXISTS before_insert_user_info ON user_info;
        -- Create the user_info table
        CREATE TABLE IF NOT EXISTS user_info (
            id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
            full_name VARCHAR(50) NOT NULL,
            mobile_number VARCHAR(10) NOT NULL UNIQUE,
            email VARCHAR(50) NOT NULL UNIQUE,
            date_of_birth DATE NOT NULL,
            password VARCHAR(100) NOT NULL,
            creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create the password hashing function using pgcrypto
        CREATE OR REPLACE FUNCTION hash_password() 
        RETURNS TRIGGER AS $$
        BEGIN
            -- Generate bcrypt salt and hash the password
            NEW.password := crypt(NEW.password, gen_salt('bf'));  -- Hash password with salt
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create the trigger to hash the password before inserting or updating a record
        CREATE TRIGGER before_insert_user_info
        BEFORE INSERT OR UPDATE ON user_info
        FOR EACH ROW
        EXECUTE FUNCTION hash_password();
    `;

    try {
        // Connect to the database
        const client = await pool.connect();

        // Execute the query
        await client.query(query);
        console.log("Schema created successfully with password hashing.");
    } catch (error) {
        console.error("Error creating schema:", error);
    }
};

module.exports = createTable;
