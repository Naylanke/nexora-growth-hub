# Nexora Growth Hub

Build a Modern SMM Panel Platform

Create a fully functional, production-ready SMM panel website with a completely original and modern user interface.

Do NOT copy Jeskieinc.com's design, layout, branding, colors, text, or visual identity. Use it only as inspiration for the type of functionality an SMM panel needs.

1. Technology

Use:

React + TypeScript

Tailwind CSS

Modern component architecture

Supabase for authentication and PostgreSQL database

Supabase Edge Functions for secure server-side API communication

Responsive design for mobile, tablet, and desktop

Dark mode as the default theme

Clean animations and transitions

Proper loading, error, and empty states

Keep API credentials completely server-side. Never expose the SMM API key in frontend code.

2. Brand

Create an original brand called:

NEXORA

The design should feel like a modern fintech/SaaS dashboard rather than a traditional SMM panel.

Design characteristics:

Premium

Minimal

Fast

Professional

Modern

Mobile-first

Glass/soft-card elements used sparingly

Subtle gradients

Rounded cards

Clean typography

Excellent spacing

Smooth hover and page transitions

Modern icons

Attractive data visualizations

Do not make the website look like a template.

3. Public Landing Page

Create a high-quality landing page containing:

Hero section

Headline:

"Grow Your Social Presence. Smarter."

Subheadline explaining that NEXORA provides fast, affordable social media growth services through an automated platform.

Buttons:

Get Started

Explore Services

Include an attractive dashboard preview/mockup.

Statistics section

Show:

Active Users

Orders Completed

Available Services

Success Rate

These should eventually be populated from the database.

How it works

Show four steps:

Create an account

Add funds

Choose a service

Place your order

Features

Include cards for:

Fast delivery

24/7 automated system

Secure payments

Real-time order tracking

API integration

Affordable pricing

Services preview

Display popular services pulled dynamically from the database.

FAQ

Create expandable FAQ items.

CTA

"Ready to grow?"

Button:

"Create Free Account"

Footer

Include:

Home

Services

API

FAQ

Terms

Privacy

Contact

Login

Register

4. Authentication

Create:

Registration

Login

Logout

Forgot password

Password reset

Email verification

Protected dashboard routes

Use Supabase Auth.

User profile fields:

ID

Name

Email

Username

Balance

Role

Referral code

Referral earnings

Created date

Roles:

user

reseller

admin

5. Main User Dashboard

Create a completely different dashboard design from Jeskie.

Desktop layout:

Sidebar navigation:

Dashboard

New Order

Services

Orders

Add Funds

Transactions

API

Referrals

Support

Settings

Mobile:

Use a modern bottom navigation or collapsible navigation drawer.

Dashboard cards:

Balance

Display current account balance.

Buttons:

Add Funds

Transaction History

Orders

Display:

Total Orders

Completed

Processing

Pending

Cancelled

Spending

Show spending statistics using a modern chart.

Recent Orders

Display:

Order ID

Service

Quantity

Amount

Status

Date

Quick Order

Create a compact quick-order widget allowing users to select a service and place an order quickly.

6. Services System

Create a services page that loads services dynamically from the SMM API.

Service fields should support:

Service ID

Category

Name

Description

Price

Minimum quantity

Maximum quantity

Average delivery time

Refill availability

Cancellation availability

Service type

Allow users to:

Search services

Filter by category

Sort by price

Sort by popularity

Favorite services

Use attractive service cards.

Do not hardcode services when the API can provide them.

7. New Order System

Create a professional order form.

Fields:

Category

Dropdown populated from available services.

Service

Dynamically filtered according to category.

Display:

Service name

Description

Price

Minimum

Maximum

Estimated delivery

Refill information

Link

Allow the customer to enter the required social media URL.

Quantity

Validate minimum and maximum quantity.

Price calculation

Calculate the total price automatically as the user changes quantity.

Display:

"Your order total: $X"

or the selected currency.

Confirmation

Before submitting, display an order confirmation modal.

When confirmed:

Validate user balance.

Validate service.

Validate quantity.

Create order.

Deduct wallet balance.

Send order securely to the SMM API.

Store provider order ID.

Return the order result.

Update order status.

Do not expose the provider API key to the browser.

8. SMM API Integration

Create a secure API integration layer.

Use environment variables:

SMM_API_URL

SMM_API_KEY

Never put these values directly into frontend code.

Create server-side functions for:

Get services

Create order

Get order status

Get multiple order statuses

Get provider balance

Request refill if supported

Cancel order if supported

Make the integration modular so I can easily replace the API provider later.

Use the API documentation I provide to map the exact endpoints and request parameters.

Do not invent API endpoints.

9. Order Management

Create a complete order management system.

Database fields should include:

Internal order ID

User ID

Provider order ID

Service ID

Service name

Category

Link

Quantity

Charge

Currency

Status

Provider status

Created timestamp

Updated timestamp

Statuses:

Pending

Processing

In progress

Completed

Partial

Cancelled

Failed

Create an order details page.

Allow users to:

View order information

Copy order ID

View status

View timeline

See purchase amount

See service details

10. Automatic Status Synchronization

Implement a secure server-side mechanism to periodically synchronize order statuses with the provider API.

Do not require the user to manually refresh the page.

When the provider status changes:

Update the database.

If the final provider status results in a refund or partial completion, correctly calculate and return the appropriate balance according to the provider's response.

Do not create duplicate refunds.

11. Wallet System

Create a proper wallet/ledger system.

Users can:

View balance

Add funds

View transactions

View deposits

View order charges

View refunds

Every balance change must create a transaction record.

Transaction types:

Deposit

Order

Refund

Referral

Adjustment

Never simply overwrite the balance without recording the transaction.

Use database transactions/RPC functions where appropriate to prevent double spending and race conditions.

12. Payment System

Create an Add Funds page.

Support a payment architecture that can later connect to:

M-Pesa

Card payments

Mobile money

Other payment providers

The payment system must use server-side verification/webhooks.

Never credit a user's wallet merely because the frontend says payment succeeded.

Create:

Payment ID

User ID

Amount

Currency

Provider

Provider transaction ID

Status

Timestamp

Statuses:

Pending

Completed

Failed

Cancelled

Make the payment provider modular so another payment provider can be added later.

13. Admin Dashboard

Create a powerful admin dashboard.

Admin navigation:

Overview

Users

Services

Orders

Payments

Transactions

Providers

Referrals

Support

Announcements

Settings

Logs

Dashboard statistics:

Total users

Active users

Total orders

Completed orders

Revenue

Deposits

Profit

Pending orders

Create charts for:

Revenue over time

Orders over time

New users

Popular services

14. Admin User Management

Admins can:

Search users

View users

Suspend users

Reactivate users

Change roles

View balances

View orders

View transactions

Manually adjust balance

Every manual balance adjustment must require a reason and create an audit log.

15. Service Management

Admins should be able to:

Sync services from provider API

Enable/disable services

Change service markup

Change service name

Change description

Change category

Set custom minimum/maximum

Hide services

Feature services

Support pricing markup.

Example:

Provider price = $1.00

Customer price = $1.30

Store both provider cost and customer price securely.

16. Reseller System

Create reseller functionality.

Resellers can have:

Custom pricing

API access

Reseller dashboard

API balance

Order history

Custom markup

Admin can enable or disable reseller access.

17. API

Create an API section for approved users.

Include:

API key generation

API key regeneration

API documentation

API balance

Service list endpoint

Order endpoint

Order status endpoint

API keys must be hashed or securely stored where possible.

Add rate limiting and authentication.

Do not expose internal admin functionality through the public API.

18. Referral System

Create a referral system.

Each user receives a referral code.

Track:

Referral clicks

Referred users

Qualified referrals

Referral earnings

Allow the admin to configure the commission percentage.

19. Support System

Create a support ticket system.

Users can:

Create ticket

Select category

Write message

Attach information if supported

View responses

Close ticket

Admins can:

View tickets

Reply

Change ticket status

Assign ticket

Search tickets

Statuses:

Open

Pending

Answered

Closed

20. Notifications

Create notification support for:

Successful deposits

Order created

Order completed

Order failed

Refund

Support reply

System announcements

Use an in-app notification center.

21. Security

Implement strong security from the beginning.

Requirements:

Supabase Row Level Security

Protected admin routes

Server-side API keys

Input validation

Rate limiting where appropriate

Authentication checks

Authorization checks

Database constraints

Audit logging

Secure webhook verification

Prevent duplicate orders

Prevent duplicate payments

Prevent negative balances

Prevent users accessing another user's orders

Never trust frontend-supplied prices or balances.

The backend must calculate the final order charge.

22. Database

Create a proper Supabase schema for:

profiles

wallets

wallet_transactions

services

service_categories

orders

payments

payment_events

referrals

referral_commissions

api_keys

support_tickets

support_messages

notifications

announcements

audit_logs

provider_sync_logs

Create appropriate indexes and relationships.

Use UUIDs where appropriate.

23. UI/UX

The interface must feel like a premium SaaS application.

Use:

Dark/light mode

Responsive cards

Smooth animations

Modern charts

Skeleton loading

Toast notifications

Confirmation dialogs

Empty states

Error states

Search

Filters

Pagination

Avoid:

Old-fashioned SMM panel layouts

Excessive gradients

Cluttered dashboards

Tiny text

Huge sidebars

Generic Bootstrap-looking components

The interface should look like a modern product such as a fintech/SaaS dashboard.

24. Mobile Experience

Mobile is extremely important.

Ensure:

Dashboard works perfectly on phones

Tables become responsive cards

Navigation becomes a mobile drawer/bottom navigation

Order forms are easy to use

Wallet/payment screens work on small screens

Buttons are touch-friendly

Test layouts around 360px, 390px and 430px widths.

25. SEO

Create SEO-friendly public pages:

Home

Services

Pricing

About

FAQ

Contact

Terms

Privacy

Add:

Proper page titles

Meta descriptions

Open Graph metadata

Semantic HTML

Sitemap support

Robots configuration

Do not expose private dashboard pages to search engines.

26. Important API Rule

I already have an SMM provider API.

Do NOT create fake API responses for the production integration.

First create the API integration layer with clearly separated configuration.

When I provide the API documentation and credentials, connect:

Service synchronization

Order creation

Order status

Provider balance

Refills

Cancellations

Only implement endpoints that are actually supported by my provider.

27. Development Approach

Build the application in a way that allows each section to be tested independently.

Start with:

Database schema

Authentication

Public website

User dashboard

Services

New order

SMM API integration

Orders

Wallet

Payments

Admin dashboard

Reseller API

Referrals

Support

Notifications

Security hardening

Do not just create static mockups.

The application should use real database operations and real server-side functions.

Where an external credential/API is required, create the integration correctly and clearly identify the environment variables or secrets I need to provide.

Final requirement

The finished website should be a fully functional, original, modern SMM platform, not a visual clone of Jeskieinc.com.

Prioritize:

Security → functionality → reliability → mobile UX → modern design.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/02aecfd4-c4ea-4f94-a398-91748d904703).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
