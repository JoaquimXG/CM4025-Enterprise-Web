# CM4025 Frontend

# Technology

Built with SvelteKit as development framework and IBM Carbon Design as design system and UI library.

# TODO
1. Text on dashboard page

## Issues
1. Issues with tabindex on modals
   - Some modals have odd tab behaviour, e.g., when tabbing through inputs fields are selected in the wrong order or not at all.
   - This is a major accessibility issue and would be addressed in a production product.
   - It is not addressed here as it does not appear to be required for the submission.
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
10. Delete self
  - with confirmation
11. Optimize calls to isauthenticated. User context is used to store user authentication status for all pages
12. Differences for admins
  - Worker management; Workers are read only for standard users but admins can create/edit/delete them
    - This limit is both frontend and backend
  - User management
    - Only admins can manage users, and only edit or delete.
    - Admins can't edit passwords
    - Only admins can see link in sidebar to view users
13. Favicon

## Maybe (Should ask in class if these are required)
1. I would have liked to use the StatefulButton on modal but maybe not very easy
2. Allow password modification

# Tags

- TODO
  - (OUTOFSCOPE) - Out of scope for this submission
