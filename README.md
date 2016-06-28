# PayUp!

A simple e-commerce store for Enonic XP.

## Shopping carts
Shopping carts are created when a user adds a item to the cart. Carts will be persisted if user is logged in,
however no login/registration form is currently implemented.

## Payments
Payments done via Stripe. A stripe account is needed to set up the application and recieve payments.
https://stripe.com

Test cards can be located here: https://stripe.com/docs/testing

## Orders
When a order is complete, it can be viewed in admin with shipping details and completion status.


##Roadmap

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
