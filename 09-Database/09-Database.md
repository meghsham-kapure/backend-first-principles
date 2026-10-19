# Databases

- In backend system the most commonly and frequently done operations are database operation.
- Database helps to persist the data of application after failures, crashes or in general intentional restarts.

## What are databases and why do we need them?

- At its core a database can be any kind of structure which can be program, system, technology or even a file that gives to ability to perform CRUD on data and store it data over period of time or sessions. It persist the data even after system that created it or performing CRUD on its data has stopped or restarted.
- Examples of database
  1. Notes stored on a notebook or text file
  2. Contact list in a phone
  3. List / Array of items in program
  4. Key-Value entries stored in local storage of browser
- In context of backend engineering, database is a persistent storage of data that allow to perform CRUD.

## Memories

- Storage of data in primary and secondary memory is done for different use-cases and comes with its own pros and cons
- Primary Memory (RAM) of a system and is very fast to operate on data, it persist data until its restarted. It is expensive and has lesser memory space and Data on it is frequently used by applications and operating systems. Caching System like Redis uses this.
- Secondary Memory is storage which is disk based device like HDD, SSD of a system and is very slow to operate and have larger memory space which can persist data over restarts and is persisted over period of time. It relatively less expensive. Database System like PostgresDB or MongoDB uses this.

## DBMS

- DBMS are softwares help to store the data and operate on it very efficiently. They also provide the scalable and secure environment for database operations.
- Disadvantages of text or file based data storage
  - Parsing : complete data has to be loaded in main memory and converted to language native format before operating on it
  - Slower: to parse and operate it takes time
  - Untrusted: data on file can have fluid structure which can changed at any time, no rules or standard to govern it.
  - Un-reliable: any one can modify it as no auth. If modified in improper method, data can be corrupted.s
  - Non-concurrent: if update are concurrent or parallel, give no consistency whose update will be there.
- DBMS provides ACID properties on data that removes all of these disadvantages.

### Types of database

1. Relational
   - organizes data in table of rows and columns and relationship among different tables is achieved through foreign keys
   - data is structured and have pre-defined schema which automatically maintains ACID properties
   - uses SQL to create schema and operated the data in those schemas
   - not flexible but robust
   - example : postgres, mySql, sqlite

2. Non-relational
   - organize data in collection of entries of key-value pairs
   - data is unstructured and has no schema. each collection can follow different structure
   - flexible but error-prone
   - to maintain ACID properties rule has to set by developer at application level
   - example : mongoDB

#### When to use to what?

- Used in system in which have pre-defined and fixed database structure can use Relational database like Customer Relation System
- Used in system in which do not have pre-defined and fixed database structure and dealing with multiple formats of data which can change overtime Content Management System
- For most of the cases POSTGRES is one that fits in with all requirements
  - open-source and large community
  - uses sql.
  - supports everything that you need or will need in future and is customization
  - support JSON to store data which give you advantage of storing any type of dynamic data.
  - very good indexing and query mechanisms
  - support migration.

## SQL Basics

### Data Types

#### 1. Numeric Types

- `SERIAL` and `BIGSERIAL`: Auto-incrementing integer types, mainly used for a table's primary key. `SERIAL` is a 4-byte integer, and `BIGSERIAL` is an 8-byte integer for tables that may hold a very large number of rows.
  - Usage: Auto-generated IDs such as user ID or order ID.
  - Example values: `1`, `2`, `3`, ... (generated automatically, you don't insert them).

- `SMALLINT`, `INTEGER`, `BIGINT`: Whole-number types that differ in size and range.
  - `SMALLINT` (2 bytes): `-32768` to `32767`. Usage: age, small counters. Example values: `25`, `1200`.
  - `INTEGER` (4 bytes): `-2147483648` to `2147483647`. Usage: quantity, general counts. Example values: `50000`, `-300`.
  - `BIGINT` (8 bytes): about ±9.2 quintillion. Usage: large counts, view counts, timestamps in milliseconds. Example values: `9876543210`, `1729300000000`.

- `DECIMAL` and `NUMERIC`: Exact numbers with decimal places. In PostgreSQL they are identical (`DECIMAL` is an alias of `NUMERIC`), They store values exactly, with no rounding errors, but are slower than floating-point types.
  - Usage: money, prices, and anything where exact precision matters.
  - Example values: `99.99`, `1500.50`, `0.07`.

- `REAL` and `DOUBLE PRECISION`: Floating-point types that store approximate values, so small rounding errors can occur. `REAL` is 4 bytes with about 6 digits of precision, and `DOUBLE PRECISION` is 8 bytes with about 15 digits of precision, making it more accurate.
  - Usage: `REAL` for measurements where exactness is not critical, such as temperature or sensor readings. `DOUBLE PRECISION` for scientific calculations, coordinates, and statistics.
  - Example values: `REAL`: `36.6`, `3.14`, `0.0025`. `DOUBLE PRECISION`: `3.141592653589793`, `12.9715987`, `77.5945627`.

#### 2. Textual Types

- `CHAR(n)`: A fixed-length string type. If the value is shorter than `n`, it is padded with spaces to reach length `n`.
  - Usage: Values that always have the same length, such as country codes or state codes.
  - Example values: `'IN'`, `'US'`, `'MH'`.

- `VARCHAR(n)`: A variable-length string type with a maximum limit of `n` characters. It stores only the characters given, with no padding.
  - Usage: Short text with a known maximum length, such as names, emails, or usernames.
  - Example values: `'Rahul'`, `'rahul@example.com'`, `'rahul_dev'`.

- `TEXT`: A variable-length string type with no length limit.
  - Usage: Long text such as descriptions, comments, or blog content.
  - Example values: `'This is a long product description...'`, `'Great article, thanks for sharing!'`.

> Prefer `TEXT` over `VARCHAR(n)` as there is no performance difference in PostgreSQL, and `TEXT` avoids managing a length limit. Use `VARCHAR(n)` only when the database must enforce a maximum length.

#### 3. Date and Time Types

- `DATE`: Stores only the date (year, month, day), with no time part.
  - Usage: Values where only the day matters, such as birth date or joining date.
  - Example values: `'2026-10-19'`, `'1999-05-21'`.

- `TIME`: Stores only the time of day, with no date. It can optionally include a time zone (`TIME WITH TIME ZONE`).
  - Usage: Values that repeat daily, such as shop opening time or class start time.
  - Example values: `'09:30:00'`, `'18:45:30'`.

- `TIMESTAMP`: Stores both date and time, without time zone information.
  - Usage: Event times where the time zone is not important or is handled by the application.
  - Example values: `'2026-10-19 14:30:00'`, `'2026-01-01 00:00:00'`.

- `TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`): Stores both date and time with time zone awareness. PostgreSQL converts the value to UTC for storage and back to the session time zone when read.
  - Usage: Created-at and updated-at columns, logs, and any app used across multiple time zones.
  - Example values: `'2026-10-19 14:30:00+05:30'`, `'2026-10-19 09:00:00+00'`.

- `INTERVAL`: Stores a span of time rather than a point in time.
  - Usage: Durations such as subscription length, time between two events, or expiry periods.
  - Example values: `'1 day'`, `'3 months'`, `'2 hours 30 minutes'`.

#### 4. Other Data Types

- `BOOLEAN`, `BOOL`: Stores a boolean value (`TRUE` or `FALSE`).
  - Usage: Flags, switches, and other binary values.
  - Example values: `TRUE`, `FALSE`.

- `UUID`: Stores a universally unique identifier (UUID) value.
  - Usage: Uniquely identifying values such as primary keys, unique identifiers, and foreign keys.
  - UUIDs are generated using the `uuid-ossp` extension, which is included in PostgreSQL by default. The `uuid-ossp` extension provides a function called `uuid_generate_v4()` that generates a new UUID value.
  - Example values: `'6e6a6c6f-6b6d-4a6e-866f-6c6d6e6f6a6c'`.

- `ENUM`: Stores a fixed set of values.
  - PostgreSQL provides the `ENUM` data type, which is a data type that stores a fixed set of values.
  - Usage: Data that has a limited number of possible values, such as the status of a product, the color of a car, or the type of a document.
  - Example values: `'OPEN'`, `'CLOSED'`, `'IN_PROGRESS'`.
  - The `ENUM` data type is useful when you have a fixed set of values that you want to restrict to.

    > Note: The `ENUM` data type is not a true enum, meaning that it does not enforce uniqueness of its values.

- `JSON`: Stores a JSON (JavaScript Object Notation) value.
  - PostgreSQL provides the `json` data type, which is a JSON value stored as a string.
  - Usage: Data that is stored in JSON format, such as configuration settings, user preferences, or API responses.
  - Example values: `'{"name": "John", "age": 30}'`, `'{"products": [{"name": "iPhone", "price": 999}, {"name": "MacBook", "price": 1999}]}'`.

- `JSONB`: Stores a JSON (JavaScript Object Notation) value.
  - PostgreSQL provides the `jsonb` data type, which is a JSON value stored as a binary string.
  - Usage: Data that is stored in JSON format, such as configuration settings, user preferences, or API responses.
  - Example values: `'{"name": "John", "age": 30}'`, `'{"products": [{"name": "iPhone", "price": 999}, {"name": "MacBook", "price": 1999}]}'`.

-`XML`: Stores an XML (eXtensible Markup Language) value.

    - PostgreSQL provides the `xml` data type, which is an XML value stored as a string.
    - Usage: Data that is stored in XML format, such as configuration settings, user preferences, or API responses.
    - Example values: `'<name>John</name>'`, `'<products><product><name>iPhone</name><price>999</price></product><product><name>MacBook</name><price>1999</price></product></products>'`.

    > Note: XML data type is not supported in PostgreSQL.

- `ARRAY`: Stores an array of values.
  - PostgreSQL provides the `ARRAY` data type, which is an ordered collection of values.
  - Usage: Data that is stored as an array, such as a list of tags, a list of addresses, or a list of products.
  - Example values: `'{"name": "John", "age": 30}'`, `'{"products": [{"name": "iPhone", "price": 999}, {"name": "MacBook", "price": 1999}]}'`.

    > Note: Arrays in PostgreSQL are homogeneous, meaning that all elements in an array must be of the same data type.

- `POINT`: Stores a point in a two-dimensional coordinate system.
  - PostgreSQL provides the `POINT` data type, which is a data type that stores a point in a two-dimensional coordinate system.
  - Usage: Data that represents a location, such as the coordinates of a store, the location of a user, or the position of a product.
  - Example values: `'(1, 2)'`, `'(3, 4)'`.
  - The `POINT` data type is useful when you need to store a point in a two-dimensional coordinate system.

- `MACADDR`: Stores a MAC address.
  - PostgreSQL provides the `MACADDR` data type, which is a data type that stores a MAC address.
  - Usage: Data that represents a MAC address, such as the MAC address of a network interface or the MAC address of a device.
  - Example values: `'00-11-22-33-44-55'`.
  - The `MACADDR` data type is useful when you need to store a MAC address.

- `INET`: Stores an IPv4 or IPv6 address.
  - PostgreSQL provides the `INET` data type, which is a data type that stores an IPv4 or IPv6 address.
  - Usage: Data that represents an IP address, such as the IP address of a server or the IP address of a client.
  - Example values: `'192.168.1.1'`, `'2001:db8:85a3:8d3:1319:8a2e:370:7348'`.
  - The `INET` data type is useful when you need to store an IP address.

- `POINT`: Stores a point in a two-dimensional coordinate system.
  - PostgreSQL provides the `POINT` data type, which is a data type that stores a point in a two-dimensional coordinate system.
  - Usage: Data that represents a location, such as the coordinates of a store, the location of a user, or the position of a product.
  - Example values: `'(1, 2)'`, `'(3, 4)'`.
  - The `POINT` data type is useful when you need to store a point in a two-dimensional coordinate system.
    4 or IPv6 address.

## Designing a Database Schema

### Naming Convention

- Table names should be plural and `snake_case`, such as `users`, `posts`, `comments`, and `personal_information`.
- Column names should be descriptive and `snake_case`, such as `first_name`, `last_name`, `email`, and `password`.
- PostgreSQL folds unquoted identifiers to lowercase, so `First_Name` and `first_name` refer to the same column unless they are wrapped in double quotes.

### Using Enums as Column Types

- Enums are a data type that represents a set of predefined values and prevents unknown values from being inserted into a column.
- Internally, each enum value is stored as a compact fixed-size value instead of the full string.

```sql
  CREATE TYPE enum_name AS ENUM ('value1', 'value2', 'value3');
```

### Using Primary Keys and Foreign Keys

- Primary keys uniquely identify each row in a table, so every record must have a unique primary key value. To generate a primary key, use the `SERIAL` or `BIGSERIAL` data type, or use the `UUID` data type with the `gen_random_uuid()` function to generate IDs automatically.
- Foreign keys establish relationships between tables. The primary key of one table is used as a foreign key in another table.

### Using Timestamps

- PostgreSQL provides the `TIMESTAMP` data type. With every record, keep track of the time of creation (`created_at`) and the time of the last update (`updated_at`).

### Using Constraints

- Every relational database provides constraints to ensure data integrity. They check whether the data being inserted is valid.
- PostgreSQL provides the following constraints:
  - `NOT NULL`: Ensures that a column cannot contain a `NULL` value.
  - `UNIQUE`: Ensures that the values in a column are unique.
  - `CHECK`: Ensures that the values in a column satisfy a specified condition.
  - `PRIMARY KEY`: Ensures that the values in a column are unique and not `NULL`, so each row can be identified.
  - `FOREIGN KEY`: Ensures that the values in a column exist in the referenced column of another table. It is defined using the `REFERENCES` keyword.

### Setting Default Values

- A default value is used when no value is provided for a column during an insert.
- Set it with the `DEFAULT` keyword, such as `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`.
- The default can be a constant value or an expression.

### Hashing Credentials

- Data like passwords, PINs, or any other secret or sensitive data should be hashed before it is stored in the database.
- PostgreSQL provides the `crypt()` function, from the `pgcrypto` extension, to hash passwords. It takes a plaintext password and a salt as input and returns a hashed password.
- `gen_salt('bf')` generates a bcrypt salt.

```sql
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  INSERT INTO users (username, password)
  VALUES ('john', crypt('john', gen_salt('bf')));
```

### Relationships in Tables

- A relationship links rows of one table to rows of another using a foreign key that references a primary key.
- There are three types of relationships:

#### One-to-One

- One row in table A is related to at most one row in table B.
- Achieved by adding a foreign key in table B with a `UNIQUE` constraint, so a parent row can be referenced only once.

```sql
  CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT
  );
```

#### One-to-Many

- One row in table A is related to many rows in table B, but each row in table B belongs to only one row in table A.
- Achieved by adding a foreign key in the "many" side table that references the primary key of thAchieved
  Achievede "one" side table.

```sql
  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL
  );
```

#### Many-to-Many

- Many rows in table A are related to many rows in table B.
- Achieved by creating a junction (join) table that holds a foreign key to each table, with a composite primary key to prevent duplicate pairs.

```sql
  CREATE TABLE post_tags (
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
  );
```

> Achieved by creating a junction table (also called a linking, join, or bridge table) that holds a foreign key to each table, with a composite primary key to prevent duplicate pairs.

### Creating Relationships with Referential Integrity

- Referential integrity ensures that a foreign key value always refers to an existing row in the referenced table.
- It is enforced by defining a foreign key with `REFERENCES`.
- Inserting a row with a foreign key value that doesn't exist in the referenced table is rejected.
- Deleting a referenced row that still has dependent rows is rejected, unless a cascading action is defined.

```sql
  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL
  );
```

### Setting Cascading Effect

- A cascading action defines what happens to the dependent rows when the referenced row is deleted or updated.
- It is set with `ON DELETE` and `ON UPDATE` on the foreign key, such as `REFERENCES users(id) ON DELETE CASCADE`.
- PostgreSQL supports the following actions:
  - `CASCADE`: Automatically deletes or updates the dependent rows.
  - `SET NULL`: Sets the foreign key column to `NULL`.
  - `SET DEFAULT`: Sets the foreign key column to its default value.
  - `RESTRICT`: Prevents the action if dependent rows exist.
  - `NO ACTION`: The default. Rejects the action if dependent rows exist, but the check can be deferred to the end of the transaction.

## Migration

- A migration is a versioned change to a database, mostly to the schema (tables, columns, indexes, constraints) and sometimes to data.
- Each change is a numbered SQL file with an "up-migration" that applies the change and a "down-migration" that rolls back the change made by the up-migration.
- A migration tool (DBMate, Flyway, Liquibase, Alembic, Prisma Migrate) runs the pending up-migration files in order and records them, so each one runs only once.
- To revert a change, run the down-migration, which brings the database back to its previous state.

- SOP for migration:
  1. Write the migration with a rollback.
  2. Always back up production before applying a migration.
  3. Test locally, then on staging, and then on production.
  4. Verify, and roll back if it fails.

- Migrations are used when implementing new features with schema changes, making performance fixes (indexes), adding new constraints, keeping all environments in sync, or moving to a new server or engine.

- Good practices:
  - Keep migration files small and simple.
  - Use the same naming convention for all migrations.
  - Use a consistent order for all migrations.
  - Keep track of applied migrations in a table, and make sure the migration files are committed to the repository.

> Use DBMate, a CLI tool, to manage migrations.

## Seeding Data

- Seeding data is used in testing to populate the database with initial sample data from a file or script.
- With testing environments setup differently than production, seeding data is done through writing a SQL script or program that inserts data into the database.

## Querying Data

- PostgreSQL provides a powerful query language called SQL (Structured Query Language) that allows you to retrieve, filter, and manipulate data stored in a database.
- with the `SELECT` statement, you can retrieve data from one or more tables.
- Syntax:

  ```sql
    SELECT column1, column2       # The columns or expressions to return. `*` returns all columns.
    join_type JOIN table_name     # The type of join to use, such as `INNER JOIN`, `LEFT JOIN`, or `RIGHT JOIN`.
    FROM table_name               # The table to read from.
    WHERE condition               # Filters rows before grouping.
    GROUP BY column1              # Groups rows that share the same values, used with aggregate functions such as `COUNT`, `SUM`, and `AVG`.
    HAVING condition              # Filters groups after grouping.
    ORDER BY column1 ASC | DESC   # Sorts the result, ascending by default.
    LIMIT count                   # Restrict the number of rows returned.
    OFFSET start;                 # Skip rows, used for pagination.
  ```

- Only `SELECT` is required to run a query, and the other clauses are optional but must appear in the order shown.

### Parameterized Queries

- Parameterized queries are queries in which the SQL text and the values are sent separately. The query contains placeholders, and the values are supplied at execution time.
- The values are always treated as data and never as part of the SQL, which prevents SQL injection.
- To create a parameterized query in PostgreSQL, use numbered placeholders (`$1`, `$2`, and so on) for the values.

```sql
PREPARE get_user (TEXT) AS
SELECT * FROM users WHERE username = $1;
```

- To call the query, pass the values separately from the query text. In SQL, this can be done with `PREPARE` and `EXECUTE`.

```sql
EXECUTE get_user('john');
```

- In application code, database drivers do this for you by accepting the query and an array of values as separate arguments.

### Filtering Data

- The `WHERE` clause filters rows before grouping.
- Syntax:

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

- Along with `SELECT` and `WHERE`, the `LIMIT`, `OFFSET`, and `ORDER BY` clauses are used to filter, sort, and paginate data.
- Combining parameterized queries with filtering and pagination is a powerful way to retrieve data from a database. These queries can be reused by the application to fetch data without any risk of SQL injection.

### Updating Data

- The `UPDATE` statement modifies existing rows in a table.
- Syntax:

```sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

- Without a `WHERE` clause, all rows in the table are updated.
- `RETURNING` can be added to get the updated rows back in the same statement.

```sql
UPDATE users
SET email = $1
WHERE id = $2
RETURNING *;
```

### Deleting Data

- The `DELETE` statement removes rows from a table.
- Syntax:

```sql
DELETE FROM table_name
WHERE condition;
```

- Without a `WHERE` clause, all rows in the table are deleted.
- `RETURNING` can be added to get the deleted rows back in the same statement.
- Deleting a row that is referenced by a foreign key is controlled by the cascading action (`ON DELETE`) defined on that key.

### Triggers

- A trigger is a function that PostgreSQL runs automatically when a specified event (`INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE`) occurs on a table.
- A trigger has two parts: a trigger function, which holds the logic, and the trigger itself, which binds the function to a table and an event.
- Triggers can run `BEFORE` or `AFTER` the event, and `FOR EACH ROW` or `FOR EACH STATEMENT`.
- Inside a row-level trigger function, `NEW` holds the new row and `OLD` holds the old row.
- Syntax:

```sql
CREATE FUNCTION function_name() RETURNS TRIGGER AS $$
BEGIN
  -- logic
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_name
BEFORE UPDATE ON table_name
FOR EACH ROW
EXECUTE FUNCTION function_name();
```

- Common use case: automatically updating the `updated_at` column.

```sql
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

### Indexing

- An index is a separate data structure that PostgreSQL maintains on one or more columns so it can find rows without scanning the whole table.
- Indexes speed up `SELECT` queries that use `WHERE`, `JOIN`, and `ORDER BY` on the indexed columns, but they slow down writes and use extra storage, because the index must be updated on every `INSERT`, `UPDATE`, and `DELETE`.
- Primary key and `UNIQUE` constraints automatically create an index. Foreign key columns are not indexed automatically.
- The default index type is B-tree. PostgreSQL also supports Hash, GIN, GiST, and BRIN indexes.
- Syntax:

```sql
CREATE INDEX index_name ON table_name (column1 order, column2 order);
```

- A unique index ensures that the values in the column are unique.

```sql
CREATE UNIQUE INDEX index_name ON table_name (column1 order, column2 order);
```

- To remove an index:

```sql
DROP INDEX index_name;
```

- Use `EXPLAIN ANALYZE` to check whether a query uses an index.
- Good practices:
  - Index columns that are frequently used in `WHERE`, `JOIN`, and `ORDER BY`.
  - Don't index every column, because each index adds write overhead.
  - In a multi-column index, the column order matters.
