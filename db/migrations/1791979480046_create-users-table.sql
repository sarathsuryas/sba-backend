-- Up Migration
CREATE TABLE users (
 id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 customer_id VARCHAR(20) UNIQUE, 
 email VARCHAR(200) NOT NULL,
  -- Stores the bcrypt hash, never the plain password
password_hash VARCHAR(255) NOT NULL,
role VARCHAR(20) NOT NULL DEFAULT 'customer'
    CHECK (role IN ('customer', 'staff', 'admin')),
status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'deactivated')),
must_change_password BOOLEAN NOT NULL DEFAULT FALSE    
failed_login_attempts
)

CREATE UNIQUE INDEX users_email_unique
ON users (LOWER(email));

-- Down Migration
DROP TABLE users