# Watch.Reseller (Backend)


### Repo Server : https://github.com/rasel-mahmud-dev/watch-reseller-backend
### Repo client : https://github.com/rasel-mahmud-dev/watch-reseller-frontend
<br />

### Server Live: https://watch-reseller-rosy.vercel.app
### Client Live: https://watch-reseller.web.app



## Packages uses.
- Expressjs
- cors
- dotenv
- jwt(jsonwebtoken)
- mongodb
- stripe (credit card payment)


## Functional requirement.
- multiple role base online shop. user can buy products.
- seller can sales their product, also they can add/update, delete, see his buyers.
- another role is admin he can delete a seller and buyer, he can see all transactions.
- only logged user can buy products.
- buyer/customer can create account with google and email and password and they can payment using credit card  

## Database.
- Mongodb (Native)


### Endpoint

#### Course endpoint
- GET /api/v1/auth [auth related end point]
- GET /api/v1/auth/generate-token
- GET /api/v1/auth/get-current-user
- GET /api/v1/auth/validate-token
- GET /api/v1/auth/logout
- GET /api/v1/auth/seller-buyers

#### product endpoint
- GET /api/v1/product [product related end point]

#### Category endpoint
- GET /api/v1/category [category related end point]

#### advertise endpoint
- GET /api/v1/advertise [advertise related end point]

#### order endpoint
- GET /api/v1/order [order related end point]

#### payment endpoint
- GET /api/v1/payment [payment related end point]

#### wishlist endpoint
- GET /api/v1/wishlist [wishlist wishlist end point]




## Preview of HomePage
![](static/home-page-copy.webp)

## Preview of Add Product
![](static/add-product-copy.webp)

## Preview of Admin dashboard all buyers
![](static/all-buyers-copy.webp)