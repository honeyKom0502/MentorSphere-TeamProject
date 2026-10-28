# MentorSphere MentorBoard & Mentorship Sessions (Exhibition MVP)

## What was added
- **Mentor Sessions** navigation item in the existing sidebar.
- Authenticated session booking for Juniors with real Senior/Alumni accounts.
- Mentor accept/decline, participant cancellation and mentor completion actions.
- MongoDB-backed session records, editable roadmap steps, notes and action items.
- Shared workspace refresh polling while an accepted session is open.
- Jitsi Meet room integration for an exhibition demo.

## Files added
- `server/models/MentorshipSession.js`
- `server/routes/sessionRoutes.js`
- `src/services/sessionService.js`
- `src/components/mentorboard/MentorBoard.jsx`
- `src/components/sessions/SessionsPage.jsx`
- `src/components/sessions/VideoPanel.jsx`

## Files updated
- `server/server.js` — registers `/api/sessions`
- `src/App.jsx` — adds the Sessions view
- `src/components/layout/FloatingSidebar.jsx` — adds Mentor Sessions navigation

## Run locally
1. Keep your existing `.env` file locally; it is deliberately not included in the shared project ZIP.
2. Ensure MongoDB is running and your existing backend environment variables are configured (`MONGODB_URI`, token secret and any existing mail settings).
3. From the project folder run `npm install`.
4. Terminal 1: `npm run server`
5. Terminal 2: `npm run dev`
6. Sign in with real MongoDB-backed accounts. Demo accounts are browser-only and cannot book shared sessions.
7. A Junior books a session with a Senior/Alumni. Sign in as that mentor in another browser/profile to accept it.
8. After acceptance, open the workspace to edit/save the roadmap, session notes and action items, and join the video room.

## Important demo limitations
- The video room uses the public `meet.jit.si` service. It is suitable for a prototype demonstration, not a guarantee of private/institution-managed calls. For a production launch, configure a trusted Jitsi deployment or another approved video provider.
- Saved board updates are refreshed between participants by polling every five seconds. This is **not** conflict-free simultaneous editing; avoid editing the same board at the exact same time. A production collaboration layer should use WebSockets/WebRTC data channels and revision/conflict handling.
- Booking currently does not send email/calendar invitations. The session is visible in the app after the request is created.
- A build could not be run in this environment because the ZIP's prebundled Vite/Rolldown native optional dependency is missing. The changed JSX files were syntax-parsed, and new backend JavaScript files passed `node --check`. Run `npm install` in your own project environment and test before the exhibition.

## Before exhibition
- Test with two real accounts (Junior + Senior/Alumni).
- Verify the MongoDB connection and `/api/health` response.
- Verify booking, accept/decline, saved roadmap, notes, cancel and video room.
- Keep a backup copy of your original project and do not replace its `.env`.
