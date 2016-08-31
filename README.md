# PayUp!

A simple e-commerce store for Enonic XP.

Download latest version from bintray:
[ ![Download](https://api.bintray.com/packages/ljl/maven/payup/images/download.svg) ](https://bintray.com/ljl/maven/payup/_latestVersion)

## Shopping carts
Shopping carts are created when a user adds a item to the cart. Carts will be persisted if user is logged in,
however no login/registration form is currently implemented.

## Payments
Payments done via Stripe. A stripe account is needed to set up the application and recieve payments.
https://stripe.com

Test cards can be located here: https://stripe.com/docs/testing

## Orders
When a order is complete, it can be viewed in admin with shipping details and completion status.

##Changelog
### [Unreleased]
#### Fixed
- Fixed site to be invalid on first import

#### Removed
- Removed unused cart import

### [1.0.6] - 2016-08-25
#### Fixed
- Fixed an error when changing a stored address

### [1.0.5] - 2016-08-24
#### Added
- Improved error handling when using wrong card input

### [1.0.4] - 2016-08-19
#### Removed
- Customer carts have been temporary disabled due to some inconsistent errors.

### [1.0.3] - 2016-08-15
#### Fixed
- Stripe Token generator was erroneously removed in a previous version

### [1.0.2] - 2016-08-15
#### Fixed
- In 1.0.1 the application key was changed, but not all references, this is now fixed

### [1.0.1] - 2016-07-12
#### Added
- Error logging and error pages
- Error message when api key is missing
- Smaller images for faster loading

#### Fixed
- Application meta data display name

#### Changed
- Cart button now has fixed positioning

#### Removed
- Cart connection from Order
- Stripe API-keys from import


##Roadmap

- ~~Use only session for carts~~
- Validation of checkout form
- Registration and login of customers
- Toggle shipping option in site config
- Shipping prices
- Preview of orders in admin
- Product page
- Order admin and order subfolders (to easy shipping process)
- Email confirmation and order id
- Internationalization of all strings
- Stock quantity on products
- Send shipment data to Stripe
- Customer pages with order history
- Selenium testing
- Modularize payment, add more providers
- Sort out permissions for carts and customers
- Close checkout by clicking outside
