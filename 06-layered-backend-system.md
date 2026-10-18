# Layered Backend System

## Flow of Request and Response Cycle

1. Client Request
   - The client sends a request to the server.

2. DNS Resolution (forward):
   - The domain name is resolved to the server's IP address.

3. TCP Connection and TLS Handshake (forward):
   - The client establishes a TCP connection with the server.
   - For HTTPS, a TLS handshake is performed to encrypt the communication.

4. Request Forwarding (forward):
   - The request is received by the proxy server (`Nginx`), which decides which backend server should handle it and forwards the request to that server.
   - The proxy server may also perform load balancing, SSL termination, and rate limiting.

5. Port Forwarding (forward):
   - The request then goes to the backend server on the destination port. If the IP address and port are correct, the request is passed to the routing algorithm.

6. Routing (forward):
   - Based on `request.path` and `request.method`, the request is routed to the right controller function.

7. Middleware (forward):
   - Before reaching the controller, the request passes through middleware such as Authentication and Authorization, CORS, error handling logging, body parsing, and rate limiting.

8. (forward):
   - Authentication verifies the identity of the client.
   - Authorization checks whether the client has permission to access the requested resource.
   - If either check fails, an error response is sent to the client.

9. Controller function (forward):
   1. It receives the `request` and `response` objects.
   2. It is responsible for extracting data from the request object, such as `request.body`, `request.query`, `request.params`, `request.headers`, `request.cookies`, `request.session`, `request.files`, etc.
   3. The collected data is deserialized from the request object and converted from JSON to language-native data types and objects.
   4. The data is validated and transformed. Default values are used for fields that have an absent or invalid value.
   5. If an error occurs during these processes, a bad request error response is sent to the client.
   6. Based on the collected data, the controller function decides which service layer function should be called and passes the sanitized data to it for business logic processing.

10. Service layer function (forward):
    1. It receives only the essential data from the request object to process the request.
    2. It may call the cache store, database, external APIs, other services, etc. to fulfill the business logic and to get the result.
    3. It manages transactions when multiple database operations must succeed or fail together.

11. Repository (forward):
    - All database-related CRUD operations are performed by the repository layer.
    - Database connections are obtained from a connection pool instead of being created for each request.
    - Read operations (select/view queries):
      - Single record: returns an entity/model object, or `null` if not found.
      - Multiple records: returns a list/collection of entities.
      - Sometimes returns a DTO, projection, or paginated result (items plus total count) instead of the full entity.
    - Write operations:
      - Create: returns the created entity (including its generated ID), or just the new ID.
      - Update: returns the updated entity, or a boolean/affected row count indicating success.
      - Delete: returns a boolean or the number of deleted rows, or nothing (`void`).
    - The exact return type depends on your design convention, but repositories should return domain entities (not raw database rows or response objects).

12. External service API call (forward):
    - The part of the business logic that is delegated to an external service is called through an asynchronous API call.
    - If the API call is expected to return a response, the service layer function awaits it and returns after a successful response.
    - If the API call is not expected to return a response, a promise can be returned immediately.

13. Service layer function (reverse):
    - After getting control back from the repository layer, the service layer either processes the remaining business logic or returns control to the controller function with a response object containing the data it processed or received from the repository / external service.
    - If the data was fetched from the database, it may be stored in the cache for future requests.

14. Error handling in the service and repository layers:
    - If an error occurs in the service layer function or repository layer, the error is logged on the server along with its stack trace.
    - Only a safe error message and an appropriate status code are sent to the client. The stack trace is never exposed.

15. Controller function (reverse):
    - After getting control back from the service layer function, the controller function extracts the result or error from the service layer's return value.
    - The result (entities / DTOs) is serialized to JSON.
    - It then wraps the result or error in the response object with the appropriate status code and headers.

16. Global Error Handler (reverse):
    - A central error handler catches unhandled errors and converts them into consistent error responses.

17. Response Delivery (reverse):
    - The response is sent from the backend server back through the proxy server to the client.

## Middleware

- Middleware is an optional function placed in the middle of the request-response cycle. It has access to the `request` and `response` objects and the `next()` function, which passes control to the next middleware or the controller function.

- Middleware functions are handlers that run logic before the request reaches the controller or after the response is generated, such as logging, authentication, parsing, or modifying the `request` and `response` objects.

- Repetitive tasks that are needed in many flows can be separated into middleware, so the code is reduced, the logic stays separated, and it can be reused.

- Middleware can be synchronous or asynchronous, and it can be written in the project or imported from external modules.

- Multiple middleware functions can be stacked to form a chain. The chain executes from top to bottom, in the order the functions are written and each middleware calls the next middleware in the chain using `next()`.

- If an error occurs, middleware can pass it to the global error handler by calling `next(error)`.

- Common uses of middleware:
  1. Security: Adds protective headers and blocks common attacks such as XSS and click jacking (for example, `helmet`).
  2. CORS: Controls which origins (domains) are allowed to access the server from a browser.
  3. Rate limiting: Restricts the number of requests a client can make in a given time to prevent abuse.
  4. Logging and monitoring: Records request details such as method, path, status code, and response time for debugging and tracking.
  5. Compression: Compresses response bodies (for example, with gzip) to reduce size and speed up delivery.
  6. File uploads: Handles file uploads, including storing them on disk, validating their size and type, and generating a unique filename.
  7. Authentication: Verifies who the client is, using a token, session, or API key.
  8. Authorization: Checks whether the authenticated client has permission to access the requested resource.
  9. Data Serialization and Deserialization: Converts data between different formats, such as JSON, XML, and protobuf.
  10. Data validation & transformation: Validates and transforms request and response data to ensure consistency and security.
  11. Global error handling: Catches errors from the chain and sends a consistent error response to the client.

## Request Context

- A request context is a per-request object or storage area that holds data tied to a single request while it moves through the middleware chain, controller, and service layers.
- It is created when the request arrives and discarded after the response is sent.
- It typically holds values such as the authenticated user, a request ID, parsed data, and the database transaction.
- For example, an authentication middleware can attach the user to the context (such as `request.user`), so later layers can read it without re-verifying.
- It reduce the need for passing data between layers, which can be error-prone and hard to maintain.
