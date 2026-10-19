# Routing

## What is Routing?

- Routing is the process of determining which endpoint to call based on the request.
- HTTP request defines "WHAT" i.e. the intent of the request and through routing we can define "WHERE" i.e. the endpoint to call to do the job and "WHICH" i.e. the method to use to do the job.
- To simplify the routing is attaching of the endpoint to called with logic that will be execute on request
- HTTP verb and url route combined creates a unique endpoint the serves a functionality on server.
- Example:`GET /api/users` this return list of users

## Types of Routing

### 1. Static Routing

- when the url is constant / unchanged and does take any parameters to route to the endpoint its called static routing
  1. `GET /api/users`: return list of users
  2. `POST /api/users` : crete a new user

### 2. Dynamic Routing

- when the url is dynamic and does get its value from parameters in url which decides which endpoint to call and which logic to execute on request is called dynamic routing
  1. `GET /api/users/1` : return user with id 1
  2. `DELETE /api/users/1` : delete user with id 1
- In backend logic we can write above endpoint as
  1. `GET /api/users/:userId` : userId is variable that get assigned value from url which will decide which user to return
  2. `DELETE /api/users/:userId` : userId is variable that get assigned value from url which will decide which user to delete
- Dynamic routing can take 2 types of parameters
  1. Path Parameters
  2. Query Parameters

#### 1. Path Parameters

- Path parameters are values in the URL path, separated by `/`, used to route to the endpoint.
- They are defined with `:` followed by the parameter name.
- They identify which resource to operate on.
- A url can have multiple path parameters which are separated by `/`.
- Example:
  1. Fetching a single resource: `GET /api/orders/:orderId` returns one specific order.
  2. Nested resources: `GET /api/users/:userId/posts/:postId` returns one post belonging to one user.

#### 2. Query Parameters

- Query parameters are key value pairs in the URL query string, appended after `?`, used to route to the endpoint.
- They are defined with `?` followed by the parameter name.
- A url can have multiple query parameters which are separated by `&`.
- Example:
  1. Filtering: `GET /api/products?category=shoes` returns only products in that category.
  2. Pagination: `GET /api/posts?page=2&limit=10` returns the second set of 10 posts.
  3. Sorting: `GET /api/users?sort=name&order=asc` returns users sorted alphabetically.

### Nested Routing

- With nested routing multiple path parameter can be collected in one endpoint
- Semantically nested routing used to access nested resources like classrooms and students or users and posts
- Example:
  1. Fetching a student with specific classroom: `GET /api/classrooms/:classroomId/students/:studentId` returns one specific student belonging to one classroom.
  2. Fetching a post with specific user: `GET /api/users/:userId/posts/:postId` returns one post belonging to one user.

## Route Versioning

- Route versioning is a technique to handle changes in the API by adding a version number to the URL.
- It allows you to make changes to the API without breaking existing clients.
- Example:
  Problem Statement: In the past version of application backend is serving the product list at `/api/products` in which result was a list of products.

  ```json
    {
      "success": true,
      "data": {
        "products": [
          { "id": "prod_001", "name": "Running Shoes", "category": "shoes", "price": 89.99, "currency": "USD", "inStock": true },
          { "id": "prod_002", "name": "Trail Sneakers", "category": "shoes", "price": 109.5, "currency": "USD", "inStock": false },
          { "id": "prod_003", "name": "Canvas Backpack", "category": "bags", "price": 49.0, "currency": "USD", "inStock": true },
          { "id": "prod_004", "name": "Insulated Water Bottle", "category": "accessories", "price": 24.99, "currency": "USD", "inStock": true },
          { "id": "prod_005", "name": "Wool Crew Socks", "category": "apparel", "price": 14.5, "currency": "USD", "inStock": true },
          { "id": "prod_006", "name": "Performance Cap", "category": "apparel", "price": 19.99, "currency": "USD", "inStock": false },
          { "id": "prod_007", "name": "Gym Duffel Bag", "category": "bags", "price": 64.0, "currency": "USD", "inStock": tru e}
        ]
      },
      "meta": { "total": 7, "page": 1, "limit": 10 },
      "error": null
    }
  ```

  Now as new with newer modifications application is serving the product object instead of list of products.

  ```json
    {
      "success": true,
      "data": {
        "products": {
          { "id": "product-001", "name": "Running Shoes", "category": "category-01-shoe", "price": "89.99 USD", "inStock": "yes" },
          { "id": "product-002", "name": "Trail Sneakers", "category": "category-01-shoe", "price": "109.5 USD", "inStock": "no" },
          { "id": "product-003", "name": "Canvas Backpack", "category": "category-02-bags", "price":" 49.0 USD", "inStock": "yes" },
          { "id": "product-004", "name": "Insulated Water Bottle", "category": "category-03-accessories", "price": "24.99 USD", "inStock": "yes" },
          { "id": "product-005", "name": "Wool Crew Socks", "category": "category-04-apparel", "price":" 14.5 USD", "inStock": "yes" },
          { "id": "product-006", "name": "Performance Cap", "category": "category-04-apparel", "price": "19.99 USD", "inStock": "no" },
          { "id": "product-007", "name": "Gym Duffel Bag", "category": "category-02-bags", "price":" 64.0 USD", "inStock": "yes"}
        }
      },
      "meta": { "total": 7, "page": 1, "limit": 10 },
      "error": null
    }
  ```

  With above changes application directly application which are using old API version will crash or will not work as expected.
  In these cases as backend developer we need to support both version of API.

Solution:
We can add version number / names to the URL to indicate which version of API is being used like f or old API version we can user `/api/products/v1` and mark them as deprecated so other developers can still use them and start migrating to new API version in upcoming updates. For new API version we can use `/api/products/v2`
After this `api/products/v1` will serve the product list till the is deprecated and `api/products/v2` will serve the product object.
