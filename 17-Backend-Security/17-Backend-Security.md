# Backend Security

- When the security aspect of an application, or any part of it, is ignored, it can cause damage to the application's resources, finances, and data. Security measures should be implemented at every level to protect the app and its data from attacks and vulnerabilities.

- As there are multiple ways to implement one thing, that one thing can be broken in multiple ways, so "everything is only secure until it gets hacked, broken, or forged."

- Anything and everything that is assumed can create a vulnerability and become the entry point of an attack. Attackers/hackers observe everything and try to find things that can be forged, bypassed, or broken.

## Security Attacks

- Attack: A deliberate attempt to gain unauthorized access to, disrupt, steal, corrupt, or damage computer systems, networks, or digital data.

- Attacker: A person or organization that seeks to compromise the security of a system, typically for personal gain or malicious purposes.

## Types of Attacks

### Injection Attacks

- Any application, regardless of the architecture or framework it uses, speaks multiple languages at different stages:
  1. Frontend (HTML, CSS, JS)
  2. Backend (TypeScript, Node), which internally uses low-level languages for file access, scripts, or machine code to interact with system hardware
  3. Database uses SQL
  4. JSON is used to communicate

- When these things work together to process data, vulnerabilities are generated at the joints where they interact with each other. Examples include SQL injection and XSS attacks. Injection attacks insert code or data at these junctions, before the data or code gets converted from one format to another, by treating data as code or as both code and data.

- Whatever is inserted into the application or storage as user input, or as data from another layer or system, has to be data only. It should be cleaned up and validated before insertion; this is the key fix for any injection attack.

#### 1. SQL Injection

![SQL Injection Attack](./reference-images/sql-injection-attack.png)

- The happy flow of the application would be: `user fills the input data -> request generation from the frontend for input processing -> backend validates, routes, and processes input -> modified data gets added to the database via SQL with the user's input`.

- But if the user input is just string concatenation in the SQL query, and an attacker somehow gets the entire query used to modify the data, they can modify the data by just changing the user input in plain text.

```sql
-- Example 1

-- Original query
UPDATE users SET password = '<input_string_new_password_by_user>' WHERE username = '<input_string_username>';

-- Attacker
UPDATE users SET password = '<input_string_new_password_by_attacker>' WHERE username = '<input_string_username>';
```

```sql
-- Example 2

-- Original query: as `'1'='1'` will always be true, the attacker gets the entire users list
SELECT * FROM users WHERE username = '<input_string_username>';

-- Attacker query:
-- `--` is a SQL comment marker. It comments out the trailing part of the original query
SELECT * FROM users WHERE username = '' OR '1'='1' --;
-- OR
SELECT * FROM users ;
-- OR delete the entire table
SELECT * FROM users WHERE username = ''; DROP TABLE users;
```

- To prevent such attacks:
  1. Use separate database users with limited permissions for DDL, DML, and querying, and require credentials to be authenticated before performing CRUD transactions.
  2. Restrict direct database access to the application only. For developers, provide a secure intermediary CLI (a gateway that holds the database credentials, authenticates the developer, and executes approved queries on their behalf) instead of direct database access. Log the change made and who made it.
  3. Pick a database and infrastructure that manages the security instead of you implementing all of it.
  4. Use parameterized queries, which can restrict injection attacks, as the passed parameters are already sanitized and validated. They also restrict code from being input as data; even if it gets through, it acts as data and not as code harming the data or the structure of the DB.
     ```js
     function getUserParameterized(username, validate, DB) {
       if (!validate(username)) return;
       const query = `SELECT * FROM users WHERE username = $1`; // user input is only treated as data
       return DB.query(query, [username]);
     }
     ```
  - MongoDB injection happens when user input is passed directly as a query object value: an attacker submits an object with operators like `$ne` or `$gt` instead of a string, changing the query logic (e.g., `{ password: { "$ne": "" } }` bypasses login). Input inside `$where` can also inject JavaScript. To fix this, always validate input types and reject object/`$` keys.

#### 2. Command Injection Attacks

- Command injection attacks target the operating system or server CLI by injecting commands into user input.
- Example:

  ```sh
  # Happy flow
  1. The application sends a command in which the input is embedded as a filename.
  2. The command compresses the filename image.
  3. It returns the new location of the file. `compress image.jpg`

  # Vulnerable flow
  1. The application sends a command in which the input is embedded as a filename. But an attacker can inject an image whose name contains a command.
  2. When executed, it shuts down the server. `image.jpg; shutdown -h now`
  ```

- These commands can:
  1. Modify or corrupt the application
  2. Add backdoors to the system
  3. Stream data or code to somewhere

- The fix for these is validating inputs, separating the code from user input, and processing the input as data only.

### Authentication Attacks

- Authentication is the process of verifying the identity of a user or system. Authentication attacks target this process to gain unauthorized access to systems or data by bypassing or impersonating legitimate users.

- Using a pre-built authentication provider system is recommended, as:
  - They save time and effort in implementing authentication from scratch.
  - They don't add development bugs and errors during development.
  - They are already tested and verified for security vulnerabilities and exploits.
  - Auth libraries handle user authentication more securely and specialize in covering all the edge cases and vulnerabilities that can be exploited by attackers.
  - They can be paid or free, self-hosted, cloud-based, or open-source, and provide modules that can be part of your authentication flow.
  - SaaS applications use social login through OAuth 2.0, which allows users to log in to third-party applications using their existing social media accounts, improving user experience and reducing the need for users to remember multiple usernames and passwords.
  - Providers have dedicated teams that monitor and respond to security threats, ensuring that the authentication system remains secure over time.

### Password Storage Attacks

- Passwords should never be stored in plain text, regardless of how secure the application and database are.

- Hashing is a one-way function that takes an input and produces a fixed-length string of characters, and it produces the exact same output for the same input. It cannot be reversed to retrieve the original input. When matching passwords, the input from the user is also hashed and compared with the stored hash. If they match, the user is authenticated. The recommended hashing technique is bcrypt with a salt.

- This protects against outside attacks and insider breaches in which passwords can be stolen and reused. Reused passwords can also be hidden from an attacker, because different systems use different hash algorithms and salts.

- Argon2id, bcrypt, and SSMT algorithms are the most recommended for hashing.

- Common Password Attacks:
  1. Brute Force Attack: An attacker tries all possible combinations of passwords until the correct one is found. Solution: Strong password policies, using uncommon and slow hash algorithms, account lockouts, and rate limiting.

  2. Dictionary and Rainbow Table Attacks: An attacker uses a precompiled list of common passwords (dictionary attack) or precomputed tables of hashed passwords (rainbow table attack) to guess or reverse-engineer the original password. Solution: Use complex passwords, avoid common words, and use salted hashes with strong hashing algorithms.

  > RESOURCE: The Lucia Auth Library was deprecated, and its author provides his experience at [Auth Book](https://auth.pilcrowonpaper.com/)

### Session Management

- In a stateless application, the user would have to provide credentials for every request, which is not user-friendly. Session management is used to maintain state between the client and the server.

- To maintain a session, the server issues a token to the user and stores it in a database or cache. The server uses the token to authenticate requests until the session is no longer valid. On the client side, these tokens can be stored in cookies, local storage, or session storage.

- Session flow:
  1. User logs in with credentials.
  2. Server generates a sessionId (a long random string of 128-256 bits, generated using a secure random string generator, impossible to guess) and its expiration time, and stores it with the userId.
  3. Create a record in storage (DB/cache) with the sessionId, userId, and expiration time. In advanced applications, user location, device, client info, and other metadata can also be stored to detect anomalies.
  4. Send the sessionId to the client in a secure cookie with the HttpOnly and Secure flags set in web applications. In mobile applications, the sessionId is sent in the response body and can be stored in secure storage.
  5. After that, the client sends the sessionId in the request header for every request to authenticate the user.
  6. The server checks the sessionId in the storage and validates it. If valid, it processes the request; otherwise, it returns an error response.

- Cookie options:
  - HttpOnly: Prevents client-side scripts from accessing the cookie, mitigating the risk of XSS attacks.
  - Secure: Ensures that the cookie is only sent over HTTPS, protecting it from being intercepted in transit.
  - SameSite: Controls whether the cookie is sent with cross-site requests, helping to prevent CSRF attacks.

#### JWT and Stateless Authentication

- When sending data back to the client, such as a token or session data, the server signs it using a JWT.

- The parts of a JWT are:
  1. Header: metadata describing the token, containing the algorithm and the type of token.
  2. Payload: Base64-encoded claims (data), including `sub` (the token's user/owner), `iat` (creation timestamp), and `exp` (expiration time), along with any custom data or custom claims.
  3. Signature: a hash of the encoded header and payload, created with a secret key (random string), used to verify the token has not been tampered with.

- Although anyone can read the data in a JWT, its advantage is that the data is immutable: it cannot be changed unless the attacker has the secret key used to sign it.

- In an auth system where JWTs are used and not stored on the server, a token cannot be immediately invalidated or revoked once it has been issued to the user. In case of an attack, the attacker stays in the system until the token expires.

- Solutions:
  1. Using a token blacklist.
  2. Using an access and refresh token model, where a short-lived access token is used for requests and a long-lived refresh token, stored on the server, is used to issue new access tokens and can be revoked.

- Storage:
  1. Local storage: commonly used, but vulnerable to XSS (JavaScript injection) attacks.
  2. Cookie storage: more secure when the `Secure` and `HttpOnly` flags are set.

> Always prefer database-based stateful authentication unless scalability and performance are a focus. For scalable, performant apps, use cache storage.

### Rate Limiting Attacks

- An attacker can overwhelm the server with requests, consuming resources and potentially causing a denial of service (DoS) attack.
- Rate limiting can be implemented at the application level or using a load balancer or API gateway.

- Types of rate limiting:
  1. Per IP address: These fail against attackers using different devices, VPNs, botnets, or proxies with rotating IPs.
  2. Per account: Fails when an attacker tries the same method or credentials but on different accounts.
  3. Global rate limiting: The system accounts for attempts made system-wide, and the failure and success rate decides when to lock the system. This can be prevented through triggering mechanisms to block IPs and by showing security mechanisms like CAPTCHA.

### Loop-whole Flows After Authentication and Authorization

- Even if the user has passed the authentication and authorization mechanisms, it does not mean the user is allowed to perform an operation without validating their clearance over that operation.
- Example: when a user has established the authentication and authorization of their identity, they should only see the data they are entitled to see and edit, and this check should be present at all routing, service, and repository layers.

### Broken Object Level Authorization (BOLA)

- BOLA means the API only verifies "you are logged in" but does not verify "whether you have permission to access this specific object," allowing an attacker to access others' data by simply changing the object ID in the request.
- For BOLA, the fix is: verify on the server that the current user owns the requested object; being logged in is not enough. Query by both object ID and user ID, enforce this on every endpoint and layer, and return 404 if it is not the user's object.

- Example:

  ```sql
  -- Vulnerable: only checks the object ID
  SELECT * FROM orders WHERE id = $1;

  -- Fixed: also filters by the authenticated user's ID
  SELECT * FROM orders WHERE id = $1 AND owner_id = $2;
  ```

  `$2` is the user ID taken from the authenticated session/token, not from client input. If the row isn't returned, respond with 404.

### Broken Function Level Authorization (BFLA)

- BFLA occurs when the same functionality is exposed through multiple routes, and some of those routes skip the authorization checks. These create false security of resources and application flow.

- Example:
  In a book management system, users can only see books for their own course and department. Each department has its own login page, and a logged-in user sees only their course and department books.
  An attacker logs in through another department's login page. Because all users share the same user table, the login succeeds, and the attacker gains access to books they are not entitled to.

- Fix: Enforce authorization on the server for every request, based on the user's own role and department rather than on which login page or route they used. Use a centralized, deny-by-default check so no route can skip it.

### Information Leakage

- In systems where responses and errors are sent back to the client in very elaborate and clear messages, an attacker can see through the data.

- Example:

  An attacker writes a script that tries logging in as N users and collects details for each. Each time, the system responds with user details or an error, either "user not found" or "credential mismatch." After the execution, the attacker has:
  1. User accounts that were logged in successfully
  2. User accounts that did not log in due to a credential error
  3. User accounts that do not exist

  If the developer uses the same error message for a credential mismatch and a user-not-found error, the attacker will not get the more accurate data above, which can be used in the next attack to find the right password for user accounts that did not log in due to a credential error.

  The fix is: for all login failures (whether the user does not exist or the password is incorrect), return the exact same generic error message, the same HTTP status code, and as consistent response timing as possible.

- Specific measures:
  1. Unify error messages and status codes.
  2. Prevent timing attacks: Even when the user does not exist, perform a dummy password hash verification so the response time matches that of an existing user, preventing attackers from inferring account existence through timing differences.
  3. Auxiliary protection: Add rate limiting and CAPTCHA to login endpoints to prevent large-scale enumeration.

### Broken Access Control Patterns

- Broken access control happens when users can act outside their intended permissions.

- Example: A normal user opens `/admin/users` or edits another user's data because the server does not check their permissions.

- Fix: Check on the server that the user is allowed to perform the action on every request, and deny by default.

### Insecure Direct Object Reference (IDOR)

- IDOR occurs when an application uses a user-supplied identifier, such as an ID in the URL, to access an object without checking whether the user owns it.

- Example: Changing `/orders/101` to `/orders/102` shows another user's order because the server does not check ownership.

- Fix: Verify on the server that the user is authorized for the requested object on every request, and don't use sequential identifiers.

## Horizontal vs Vertical Privilege Escalation

- Horizontal: A user accesses another user's data at the same privilege level.
  - Example: Changing `/orders/101` to `/orders/102` shows another user's order.
  - Fix: Check on the server that the user owns the requested object.
- Vertical: A user gains access to functions reserved for a higher privilege level.
  - Example: A normal user calls `DELETE /admin/users/5` and the server allows it.
  - Fix: Check on the server that the user's role permits the action, and deny by default.

## Good Practices for Securing Authentication and Access Control

1. Use centralized authorization: implement one shared mechanism that checks every request.
2. Deny by default: allow only what a user is explicitly permitted to do, rather than blocking specific actions.
3. Test authentication flows: look for edge cases and bypasses early, and fix them during development.
4. Write and automate test cases so every change is tested consistently and comprehensively.
5. Audit and log critical operations, including who performed them.
6. Log critical failures so they can be monitored, and block the source if the failures keep repeating.

## Cross-Site Scripting Attacks (XSS)

- XSS is a security vulnerability in which an attacker injects malicious scripts into a trusted website, causing them to execute in the user's browser.These scripts can steal sensitive information, modify webpage content, or perform malicious actions on behalf of the user.

- From a backend perspective, XSS is a security vulnerability in which an attacker injects malicious JavaScript into a website through untrusted user input, which gets executed in another user's browser when the website renders that input.

### Stored XSS (Stored Cross-Site Scripting)

- Stored XSS occurs when an attacker injects malicious JavaScript into a website through input, and the backend accepts an stores that inputted script in the database. When another user visits the page displaying that data, the browser executes the malicious script.

- Example
  1. An attacker submits a comment containing malicious JavaScript designed to send accessible browser cookies to a remote server.
  2. The backend stores the comment in MongoDB.
  3. Another user visits the comments page.
  4. The frontend retrieves the stored comment and renders it as executable HTML.
  5. The browser executes the injected JavaScript, potentially sending accessible cookies to the attacker's server.
  6. The attacker may use stolen session cookies to impersonate the victim and access their account.

- This is called a Stored XSS attack in which script is stored in the database, which is why this is called Stored XSS.

- "User input treated as code" is root cause of XSS attacks so sanitizing users input, stripping of any code in it or simply denying the request it way to prevent such attacks.

#### CSP (Content Security Policy)

- CSP is a browser security mechanism that controls which scripts, styles, images, and other resources a website is allowed to load or execute. CSP is typically applied through the HTTP Content-Security-Policy response header sent by the backend. It helps prevent XSS attacks by blocking unauthorized or malicious scripts from executing in the browser.

- Example: Backend sends `Content-Security-Policy: script-src 'self'`. The browser allows scripts from your own website but blocks inline scripts like `<script>alert('XSS')</script>` from executing. If rendered using `innerHTML`, the script is treated as an HTML element but is not executed. If rendered using `textContent`, it appears as plain text.

- CSP acts as an additional line of defense. It does not prevent XSS vulnerabilities but helps block malicious scripts from executing. To prevent XSS, developers should properly validate and sanitize untrusted input and safely render user-generated content.

## Cross-Site Request Forgery (CSRF)

- CSRF is an attack in which an attacker tricks an authenticated user's browser into performing unintended actions using the user's stored credentials.

- CSRF is less common in modern applications with proper protections but remains a risk in legacy and poorly secured applications.

- Example:
  1. A user logs into `bank.com`, and the browser stores authentication cookies.
  2. The same browser visits `evil.com`, which contains a malicious script or form that sends a request to `bank.com`.
  3. Since the request is sent from the user's browser, the browser automatically attaches the cookies belonging to `bank.com` (if cookie settings permit it).
  4. `bank.com` receives the request and, without proper CSRF protection, assumes it was intentionally initiated by the authenticated user.
  5. The unintended transaction is successfully executed.

- Cookie options `SameSite=Lax` (default in browser) or `SameSite=Strict` and help prevent cookies from being sent with cross-site requests, reducing the risk of CSRF attacks.

### CORS and CSRF Relationship

- CORS provides limited protection against certain cross-origin requests, but it is not a complete CSRF protection mechanism.

- Example:
  1. A user logs into `bank.com` and visits `evil.com` in the same browser.
  2. `evil.com` sends a request to `bank.com` to transfer money using the victim's browser.
  3. The browser automatically attaches `bank.com` authentication cookies (if cookie settings permit).
  4. `bank.com` processes the request and executes the transaction.
  5. The browser blocks `evil.com` from reading the response because `bank.com` does not allow `evil.com` through its CORS policy.

- CORS prevents unauthorized JavaScript from reading the response, but it does not necessarily prevent the request from reaching the backend and executing.

- Therefore, CORS alone cannot prevent CSRF. Use CSRF tokens and `SameSite` cookie settings for protection.

## Bad Practices Creating Security Risks and Vulnerabilities

1. Misconfiguration:
   - Incorrect configuration or secret management can expose sensitive information such as API keys, passwords, and database credentials, potentially compromising the application.
   - To prevent this, use standardized configurations, store secrets securely in environment variables or a secrets manager, and review configurations before deploying to production.
   - If secrets are accidentally exposed, rotate all compromised credentials immediately, update the configurations wherever they are used, and revoke the old credentials.

2. Logging in Production:
   - Detailed logs can expose sensitive information such as server internal state, application architecture, database details, stack traces, and transaction data.
   - To prevent this, configure appropriate log levels for different environments:
     1. Production: Log only necessary information.
     2. Testing: Enable detailed logs for debugging.
     3. Development: Enable detailed logs and stack traces.

3. Responses in Production:
   - Detailed error responses can expose internal implementation details, database information, stack traces, and sensitive data to users.
   - To prevent this, return generic error messages to clients in production while keeping detailed error information in server logs.

4. Using Missing or Incorrect Security Headers:
   - Missing or incorrectly configured security headers can expose applications to attacks such as XSS and clickjacking.
   - To prevent this, configure appropriate security headers:
     - CSP (`Content-Security-Policy`): Helps prevent XSS by controlling which scripts and resources the browser can load or execute.
     - X-Frame-Options: Helps prevent clickjacking by controlling whether your website can be embedded in frames.

5. Unsafe Data Conversion:
   - Assuming data types, formats, or behavior when data crosses application boundaries or gets converted from one format to another can introduce security vulnerabilities.
   - Always validate and verify data types, formats, and expected behavior at every application boundary.

6. Never Trust User Input:
   - Always treat user input as untrusted, regardless of its source.
   - Validate, sanitize, and verify incoming data before processing or storing it.

7. SQL Query String Concatenation:
   - Building database queries using string concatenation with user input can lead to SQL injection attacks.
   - Use parameterized queries or prepared statements instead of string concatenation.

8. Unmonitored Systems:
   - Failing to monitor application activity, errors, suspicious requests, and system behavior can allow attacks to go unnoticed.
   - Implement proper logging, monitoring, and alerting to detect suspicious activities.

9. Missing Request Restrictions:
   - Not restricting frontend requests can allow excessive, duplicated, malformed, or unnecessary requests to reach the backend.
   - Implement backend validation, rate limiting, request size limits, and idempotency where required.

### Resources

- PortSwigger Web Security Academy: [https://portswigger.net/web-security/all-materials](https://portswigger.net/web-security/all-materials?utm_source=chatgpt.com)
- OWASP Top 10: [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/?utm_source=chatgpt.com)
- OWASP Cheat Sheet Series: [https://cheatsheetseries.owasp.org/](https://cheatsheetseries.owasp.org/?utm_source=chatgpt.com)
