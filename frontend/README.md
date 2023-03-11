# CM4025 Frontend

# Technology

Built with SvelteKit as development framework and IBM Carbon Design as design system and UI library.

# TODO

1. Allow password modification
4. Delete self
  - with confirmation
1. Differences for admins?
  - View all data?
  - User management? Yes probably required.
    - Only show user management link in nav if the user is admin
  - Worker management
    - Should be read only for normal users and editable for admins

## Issues
1. Optimize calls to isauthenticated, can be in a store or maybe in context
2. Issues with tabindex on modals

## Done
1. Login
2. Logout
3. Profile page
4. Home page
5. Basic CRUD pages
   - Read
     - list
     - retrieve
   - Create
   - Update
   - Delete
  - Simple reactivity
    - Error messages, toasts, field erorrs etc.
6. Formatting for fields
  - E.g., £ sign for cost fields, and seconds should be in local time format hh:mm:ss
7. Improve time input, should at least be number but is it possible to use the time input componenet without a timezone
8. Links to related items
9. Button in overflow for calculating cost fields

## Maybe
1. I would have liked to use the StatefulButton on modal but maybe not very easy
