# Clean edition – changes integrated from original ZIP

- **Policies:** declare revision state and category setter correctly; preserve published AUP card.
- **Navigation:** remove direct Promise returns from six `useEffect` hooks; add page-level and root error boundaries; bookmarkable hash URLs.
- **Notifications:** render page with safe loading effect rather than blanking on exit.
- **MFA:** QR-based authenticator enrolment with optional manual key; pending secret DB migration and verified key rotation; authenticator challenge retained.
- **Profile:** editable display name; email remains login identifier; initial bootstrap display name configurable with `BOOTSTRAP_NAME`.
- **Courses:** upload and preview private cover image; existing image references render on course cards.
- **Uploads:** accessible drag-and-drop or Browse file selection for course covers, learning resources and completion evidence; file-type and size feedback.
- **Sensitive fields:** eye show/hide controls for passwords and MFA codes; temporary invitation credential concealed until revealed.
- **Sidebar:** always-available toggle, collapsible on desktop and remembers preference; mobile menu retained.
- **Dependencies:** Nodemailer version constraint moved to 10.0.16 and Multer to 2.x; npm audits must still be run after installation.
- **Local dev:** Vite binds localhost rather than LAN IP; Docker production build remains nginx-based.

Rebuilt from the supplied original `SecurAware_Windows_Ready_Source(1).zip`; older patch ZIPs must **not** be applied.
