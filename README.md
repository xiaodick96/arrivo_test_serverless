# arrivo_test

Here is the information for this project. 

May test on the website: https://lm0nnm20c1.execute-api.ap-southeast-1.amazonaws.com/dev/

Admin id -> admin, pw -> admin

Normal id -> normal, pw -> normal

Premium id -> premium, pw -> premium

# Environment
1. AWS Lambda
2. AWS RDS(Singapore) -- Mysql![image](https://user-images.githubusercontent.com/33863094/194051732-8ae57fe7-ec2c-4bd6-a610-f75c4bf2561a.png)

3. Node Js
4. HBS

- **Before Run the project, you should run npm i to install the modules first, so only make sure the project can work.**
- **Make Sure your .env file need to add auth0 Issuer Base Url, client id, Base Url and Secret**
- **Make Sure your .env file need to add billplz api key**
- **Make Sure your .env file need to add db host, port, user, pasword, database**

Serverless will launch the server.js to run the project.

server.createserver is the main function to **host** the server

server.* is the api-gateway of the lambda, 

For my every routes of main function, i would call the api with the axios, 

After use the axios, i will get back the variable from my api-gateway , and get the data i need.

# node_modules include

**aws-serverless-express**

**express**

**body-parser**

**path**

**handlebars** // for frontend .hbs

**express-handlebars** // for frontend .hbs

**@handlebars/allow-prototype-access** // for frontend .hbs

**express-session**

**express-mysql-session**

**mysql2**

**express-openid-connect** // Auth0

**dotenv**

**BillPlz**

**axios**

# What this project do?

1. When user haven't sign in / sign in with Auth 0, then will stay in login page
2. After user sign in, then will show out different page look with different membership role ( Admin can visit User List page, Normal & Premium only can visit Post & Category page)
3. Admin may go to User List page to add new account, Post & Category Add New Post or Category Type. Normal & Premium can only See Post & Category, cannot add, edit and delete to both.
4. Premium User can see all type of Post, but Normal User can only see Normal Content Post.
5. Normal & Premium User can see all Category.
6. Normal User may become Premium User by click Premium on profile page, after pay success, then will become Premium.

# Permission for Admin
1. Create User, See All User Data, Edit User, Delete User
2. Create Post, See All Post(Normal / Premium), Edit Post, Delete Post
3. Create Category, See All Category, Edit Category, Delete Category

# Permission for Normal / Premium User
1. Visit Other User Profile / Edit Own User Data (If go to other edit pages, will be redirect to home page after click the submit button)
2. Premium : See All Post, Normal : See Normal Post
3. See all Category Type
4. Normal User can Purchase Premium member in their profile page, Premium wont show out the Purchase Premium button (Before Purchase Premium Member need make sure the user **Email** is correct type)

# MySQL Access Credentials

- RDB_DB_HOST = arrivo-db.ceqvz4erhknq.ap-southeast-1.rds.amazonaws.com
- RDB_DB_PORT = 3306
- RDB_DB_USER = localhost
- RDB_DB_PASSWORD = password
- RDB_DB_DATABASE = arrivo_test

# Database Structure
1. User

![image](https://user-images.githubusercontent.com/33863094/194050096-19eed717-407c-4931-b91b-fb6dcc970ed0.png)

2. Post

![image](https://user-images.githubusercontent.com/33863094/194050165-02d48cd8-24c6-449b-be94-96104dff0cca.png)

3. Category

![image](https://user-images.githubusercontent.com/33863094/194050231-c4ee9193-b96f-4aa1-bba5-ef600bcdb6ef.png)

4. Payment

![image](https://user-images.githubusercontent.com/33863094/194050279-6c7dc948-8909-401b-ba27-8536e743ce03.png)

# Route Directory Link List

1. Home.js

- '/' -> Login Page

- '/home' -> Home Page ( After Login)

- '/newUserfromAuth0' -> New User From Auth0

2. User.js

- '/user/list' -> User List Page ( Can be viewed by **Admin** only )

- '/user' -> Add New User Page

- '/user/:id' -> User Profile

- '/user/edit/:id' -> Edit User Page

3. Post.js

- '/post/list' -> Post List Page

- '/post' -> Add New Post Page ( Can be add by **Admin** only )

- '/post/detail/:id' -> Post Detail Page

- '/post/edit/:id' -> Edit Post Page ( Can be edited by **Admin** only )

4. Category.js

- '/category/list' -> Category List Page

- '/category' -> Add New Category Page ( Can be add by **Admin** only )

- '/category/detail/:id' -> Category Detail Page

- '/category/edit/:id' -> Edit Category Page ( Can be edited by **Admin** only )
