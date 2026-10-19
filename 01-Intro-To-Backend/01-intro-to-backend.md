# Introduction to Back-end

## What is Back-end?

- computer listing for requests (http, grpc, etc) on dedicated port and has associated ip address / domain name which is publicly accessible
- accepts data from front-end (web, mobile, etc), performs some processing, and returns data to front-end
- data could be anything from a simple text , HTML, JSON or some complex data structures that back-end and front-end can understand
- client makes a request to back-end and back-end responds with data

## Components of Back-end System

1. Front-end is application which user user to interact with the back-end. It could be a web application, mobile application, or any other application that makes requests to back-end. In case of web application, it is a web browser (Google Chrome).

2. Server Domain is address of the back-end server. Every domain is linked to a to a IP address where the server is hosted. Subdomains are internal endpoints of the domain where requests are made with different intentions, every other endpoint has different intent and functionality. For example
   - `www.example.com` is the domain
   - `api.example.com` is the subdomain
   - `www.example.com/api/v1/users`, `www.example.com/api/v1/posts` and `www.example.com/api/v1/comments` are the endpoints

3. Domain Name System (DNS) is a system that translates human readable domain names to IP addresses.
   - DNS records represent the relationship between a domain name and an IP address.
   - Every DNS record has a type, a name,a value and a Time To Live associated with it.
   - DNS providers like AWS may have firewalls that block requests to certain domains.
   - Domains are registered with registrars like GoDaddy, NameCheap, etc.
   - Instance hosted on AWS, Google Cloud, Digital Ocean, etc.
   - Security Groups are used to control access to the back-end server and allow only specific IP addresses and ports to access the server. To correctly route requests to the back-end server, the firewall must be configured to allow requests to the correct ports and IP addresses.
   - Flow is like this `User → Client → Domain → AWS Server → Firewall → Nginx → IP Address → Port →  Application`

4. Reverse Proxy is a server that sits in front of the back-end server and handles incoming requests. It request handling logic and forwards the request to the dedicated back-end server based on the domain name and the request type. Nginx is the most popular reverse proxy server.

## Why do we need back-end?

For example, you are scrolling through a social media website and you see a post, you link that post and add commends to it. On the other hand, user whose post you viewed, liked and commented on has gotten a notification on their mobile device. This is the task performed by the back-end server behind the sean.

- Adding a new post was request which added the post to the database and returned the post id.
- Multiple post appearing on on the same page was a request which fetched the posts from the database and returned the post data.
- Like a post was a request which updated the post in the database and returned the post data.
- Comment on a post was a request which updated the post in the database and returned the post data.

All of these requests are handled by the back-end server and all the time the back-end server was doing some kind of operation on the data and database

### Why not do everything on the front-end?

Although front-end is also given by a request to server, it does not execute on server client application like browser or specific mobile application is the runtime rendering the UI and data.

As browser only downloads code from remote server and executes it, it is not possible to execute any kind of logic on the server. This can very dangerous if the server is compromised and it logic has some malicious code.

To protect from this browser has CORS (Cross Origin Resource Sharing) which is a mechanism to allow cross origin requests. In simple way CORS just restricts the code from accessing computer resources and calling other domain api.

Due to these restrictive access front-end system have limited capabilities and cannot do all the things that back-end can do like writing to database, calling other domain api, etc.

Also front-end can be run on any devices out of which some devices has limited resources like CPU, RAM, etc running a powerful server operations on them can be degrade user experience.

That's why back-end is needed to handle all the requests and execute the logic on the server and having them on front-end is not a good idea.
