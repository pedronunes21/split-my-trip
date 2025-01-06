# Split my Trip

## TO-DO

Screens
[] To create an expense
[] To create a group
[] To edit a group
[] To delete a group
[] Summary (to see how much you owe and how much people owe you) (by group)
[] Profile?
[] Homepage

Functionalities
[] Filters by people and date in the transactions list
[] Buttons for creating an expense
[] Buttons for navigation (go back a page)
[] Bottom Bar
[] Button to delete your own expense
[] Send notification when you participate in a expense
[] Create illustrations for the groups banner
[] Finish a trip
[] Create tests for functionalities
[] Create a stack in sessionStorage for navigation (go back arrows)

Fix:
[x] Throw errors with NextResponse.json with status
[] Pass cookies in server side fetch
[x] Open dialog when user clicks on an expense, with more information
[x] If expense was in the same day, show only time, else, show date
[x] Filter summary to user
[x] Screen to generate qrcode and link
[x] Screen to follow qrcode and link
[x] Generate another invite code with a button
[x] Test create account with invite link page
[x] Create expense
[] Pagination
[] Create screen for error, when fetch went wrong
[] Redirect user to register if not logged in and try to access private page
[] Delete expense if was created by you
[] Add more images to banner and user icon
[] Finish a trip
[] Screen to show how much you owe to whom

## Process

1. Button for starting a trip
2. Fill in trip's name, trip's picture, your name and your picture
3. Generates a QRCode and an invitation link
4. Friends scan the QRCode or access the invitation link
5. They are then redirected to a page to fill name and picture
6. Save information on Postgres and the information with ID on LocalStorage or IndexedDB.
7. Make operation with user's ID. Check only if user is part of a group

** Eliminate the need to create a formal account
** If the LocalStorage is cleared, the access to the account is lost

- The group has a "admin" field with the ID of the user who created it
- Admin user can remove people from group. Anyone can create an expense
- Create pages as /[group_id]/:path\*

## Tables

- Groups
- Users
- Invitations
- Expenses
