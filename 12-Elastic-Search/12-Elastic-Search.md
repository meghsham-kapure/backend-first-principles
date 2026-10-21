# Search Optimization for Elastic Search

## Basic Search Flow

- Flow of a search request:
  1. User submits a search query.
  2. Frontend sends a request to the backend API.
  3. Backend calls Database Search functionality to search for the query in the database.
  4. Database Searches for matching records in the database and returns the results.
  5. Backend processes the results and returns the response to the frontend.
  6. Frontend displays the results to the user.

- On a normal day with fairly small data, the above flow is taking `50-100 Milliseconds` to complete but as databases grow, it can take more time to complete and with more and more users, it can become a bottleneck.

- Also search result are only those record which exactly match the query. In case of typo, partial match, or fuzzy match, the search result will be less

- No smart search will be performed like if user search for "laptop" then it will only show products which contain "laptop" in the title or description. and product which are not containing "laptop" in the title or description will not be shown even if they are better options for the user.

## Elastic Search

- Elastic Search is solution to search performance issues like search query optimization, search result ranking, and search relevance.

- It is a search and analytics engine, usually run alongside a primary database and used to store data that is searchable.

- Elastic Search uses "Inverted Index" to store the data and search the data powered by Apache Lucene.

### Inverted Index

- An inverted index is a data structure that stores the data required to search documents quickly.

- Extending the product search example: instead of searching the products directly in the database, we create an index that stores keywords and their respective product IDs, like `{ "laptop": [product_id_1, product_id_415,product_id_148], "macbook": [product_id_21], "apple": [product_id_314, product_id_415], "sleve": [product_id_1,product_id_4]}`.

- Now whenever a user searches for "laptop", the search engine can look up the index and find the product IDs that match the query.

- Here we inverted the strategy of searching the product ID by name by searching the name by the product ID.

### Search Ranking and Relevance

- Search ranking is the process of ordering search results by how well they match the search query. The best-matching results appear first. For example, if a user searches for "laptop", the results show laptops sorted by their rank.

- Search relevance is the measure of how closely a search result matches the search query. Results that are relevant to the query are shown, even if they are not an exact match. For example, if a user searches for "laptop", the results may also include laptop accessories.

- BM25 is a popular ranking algorithm used in Elastic Search which decides the Ranking and Relevance of the search results.

### Type tolerance

- Type tolerance is Features of Elastic Search which is the ability of Elastic Search to find typos in the search query and return the correct results.

- Google Search uses a technology that is based on "Type ahead" which can predict the user's intent and suggest the correct spelling. and Postgres also provide full text search with typo tolerance support.

#### BM25 Algorithm

- BM25 is a ranking algorithm that is used to calculate the relevance of search results and based on how close the relevant 2 documents are to the query they are ranked

- It decides the ranking and relevance of the search results based on the following factors:
  1. Term Frequency (TF) : The number of times a term appears in a document.
  2. Document Frequency (DF) : The number of documents that contain a term.
  3. Document Length (DL) : The length of the document.
  4. Filed Boost (FF) : WHere the search term appears in the document which can be configured by the user. The higher the FF, the more relevant the document.

## ELK stack

- ELK stack combines Elastic Search, Logstash, and Kibana to provide a complete solution for collect, manage, and analyze logs

## Implementation

Goal: Compare the search speed of PostgreSQL (`ILIKE`) and Elasticsearch on the same 5 million products.

### Infrastructure

- Two Docker containers: `elastic_search_postgres` (Postgres 17, database `elastic_search_db`) and `elastic_search_es` (Elasticsearch 8.17.0, security enabled, user `elastic`).
- Next.js app (App Router, TypeScript, Tailwind, shadcn/ui).

### Data

- `scripts/generate-data.ts` creates fake products (`title`, `category`) in `data/products.csv`.
- `scripts/populate.ts` loads the CSV in batches into the Postgres `products` table and the Elasticsearch `products` index.
- Both stores hold 5,000,000 rows.

### Search logic

- Postgres: `WHERE title ILIKE '%term%'`, which scans the table.
- Elasticsearch: a `match` query on `title`, which uses the inverted index and relevance scoring.

### App

- `app/api/search/route.ts` runs both searches in parallel and streams each result as soon as it finishes.
- `app/search-demo/page.tsx` shows two side-by-side cards with the time, total count and first 20 results per engine.
- The code was refactored into `lib/config`, `lib/db`, `lib/elastic`, `lib/search` and `components/search-demo`.

### Benchmarks from the terminal

- `scripts/benchmark.ts` (run with `pnpm benchmark`) and `benchmark.sh` run 5 queries against both engines and print the average time per query, the overall average and the speed ratio.

### Open issues

- The `/search-demo` page showed mock data from `lib/demo-data.ts`. The fix prompt is ready to send to Claude Code.
- Claude Code's gateway providers are failing (NVIDIA model removed, Kiro credits exhausted, Gemini rate limited), so it needs a working model first.

#### [https://github.com/meghsham-kapure/searching-in-elasticsearch-vs-postressql ](https://github.com/meghsham-kapure/searching-in-elasticsearch-vs-postressql.git)
