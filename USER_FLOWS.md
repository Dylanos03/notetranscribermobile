# User Flows - Voice-to-Notion Mobile App

This document outlines the complete user experience flows for the Voice-to-Notion mobile application.

---

## 1. First-Time User Flow (Onboarding)

### Screen 1: Welcome/Splash Screen
**Purpose:** Introduce the app and its value proposition

**UI Elements:**
- App logo/branding
- Headline: "Turn Voice Notes into Polished Notion Pages"
- Subheadline: "Record your thoughts, we'll organize them"
- "Get Started" button (primary CTA)

**Actions:**
- Tap "Get Started" → Navigate to Notion Setup Screen

---

### Screen 2: Notion Integration Setup
**Purpose:** Guide users to connect their Notion workspace

**UI Elements:**
- Progress indicator (Step 1 of 2)
- Title: "Connect Your Notion"
- Instructions card with steps:
  1. "Open Notion and create an integration"
  2. "Copy your Integration Token"
  3. "Create or select a database for your notes"
  4. "Copy your Database ID"
- Text input: "Notion Integration Token"
  - Placeholder: "secret_xxxxxxxxxxxx"
  - Secure entry (password-style)
- Text input: "Notion Database ID"
  - Placeholder: "abc123def456..."
- Link: "How do I find these?" (opens help modal/webview)
- "Continue" button (disabled until both fields filled)
- "Skip for Now" link (bottom)

**Actions:**
- Fill in both fields + Tap "Continue" → Navigate to Permissions Screen
- Tap "Skip for Now" → Navigate to Permissions Screen (with warning that recording won't save)
- Tap "How do I find these?" → Show help modal with step-by-step guide

**Validation:**
- Check token format starts with "secret_"
- Check database ID is valid UUID format
- Optional: Test connection to Notion API

---

### Screen 3: Microphone Permission
**Purpose:** Request microphone access

**UI Elements:**
- Progress indicator (Step 2 of 2)
- Title: "Enable Microphone Access"
- Illustration/icon of microphone
- Explanation: "We need microphone access to record your voice notes"
- "Allow Microphone Access" button
- "Maybe Later" link (bottom)

**Actions:**
- Tap "Allow Microphone Access" → Trigger system permission dialog
  - If granted → Navigate to Main Recording Screen
  - If denied → Show inline error + "Try Again" button
- Tap "Maybe Later" → Navigate to Main Recording Screen (with limited functionality)

---

## 2. Main Recording Flow

### Screen 4: Main Recording Screen (Home)
**Purpose:** Primary interface for recording voice notes

**UI Elements - Idle State:**
- Header:
  - Title: "Voice Note"
  - Settings icon (top right)
  - Notion status indicator (green dot if connected)
- Center area:
  - Waveform container (empty/flat when idle)
  - Timer display: "00:10" (showing max time)
  - Large circular record button (purple gradient)
    - Microphone icon in center
  - Status text: "Ready to record"
- Bottom:
  - Info text: "Maximum recording time: 10 seconds"
  - Playback button (only visible if previous recording exists)

**UI Elements - Recording State:**
- Header: Same as idle
- Center area:
  - Animated waveform (reacting to voice volume)
  - Timer counting down: "00:09" → "00:08" → ...
  - Large circular button (darker purple, pulsing)
    - Pause/stop icon in center
  - Status text: "Recording... Tap to stop"
- Bottom: Same as idle

**Actions - Idle State:**
- Tap record button → Start recording
  - Request mic permission if not granted
  - Start countdown timer
  - Begin audio metering for waveform
  - Change UI to recording state
- Tap settings icon → Navigate to Settings Screen
- Tap playback button → Play previous recording audio

**Actions - Recording State:**
- Tap stop button → Stop recording
  - Save audio file
  - Show processing overlay
  - Navigate to Processing Screen
- Timer reaches 00:00 → Auto-stop recording
  - Same flow as manual stop

---

### Screen 5: Processing Screen
**Purpose:** Show progress while transcribing and saving to Notion

**UI Elements:**
- Full-screen overlay (semi-transparent background)
- Processing card (center):
  - Animated spinner/loading indicator
  - Status text (updates through stages):
    1. "Transcribing your note..."
    2. "Polishing with AI..."
    3. "Saving to Notion..."
  - Progress bar (optional)
- Cancel button (bottom) - optional feature

**Flow:**
1. Upload audio to backend → `/api/transcribe`
2. Backend processes with Whisper API
3. Backend polishes text with GPT-4o-mini
4. Backend creates Notion page → `/api/create-note`
5. Navigate to Success Screen

**Error Handling:**
- If transcription fails → Show error modal + "Try Again" button
- If Notion save fails → Show error modal + "Retry" or "Save Locally" options
- Network timeout → Show appropriate error message

---

### Screen 6: Success Screen
**Purpose:** Confirm note was saved successfully

**UI Elements:**
- Success animation (checkmark, confetti, etc.)
- Title: "Note Saved to Notion!"
- Generated title preview (card):
  - Shows AI-generated title
  - Snippet of polished text (first 2-3 lines)
- "View in Notion" button (opens Notion page in browser/app)
- "Record Another Note" button (primary CTA)
- "Done" link (bottom)

**Actions:**
- Tap "View in Notion" → Open Notion page URL in browser/Notion app
- Tap "Record Another Note" → Navigate to Main Recording Screen
- Tap "Done" → Navigate to Main Recording Screen

---

## 3. Settings Flow

### Screen 7: Settings Screen
**Purpose:** Manage app configuration and Notion connection

**UI Elements:**
- Header:
  - Back button (top left)
  - Title: "Settings"
- Sections:

#### Notion Integration
- Status card:
  - Green indicator + "Connected to Notion"
  - Database name (if available)
  - Last sync time
- "Update Integration" button
- "Disconnect" button (danger color)

#### Recording Settings
- Recording length slider/picker
  - Options: 10s, 20s, 30s, 60s
  - Current: 10 seconds
- Audio quality toggle
  - Standard / High Quality

#### Account (Future Phase)
- "Sign In / Create Account" (if not auth MVP)
- Email display (if signed in)
- "Sign Out" button

#### Other
- "Help & Support" link
- "Privacy Policy" link
- "Terms of Service" link
- App version number

**Actions:**
- Tap "Update Integration" → Navigate to Notion Setup Screen (pre-filled)
- Tap "Disconnect" → Show confirmation dialog
  - Confirm → Clear stored credentials + show success toast
- Adjust recording length → Save preference locally
- Toggle audio quality → Save preference locally
- Tap back button → Navigate to Main Recording Screen

---

## 4. Re-Configuring Notion Flow

### Screen 8: Update Notion Integration
**Purpose:** Allow users to change Notion credentials

**UI Elements:**
- Similar to Screen 2 (Notion Integration Setup)
- Pre-filled with existing credentials (masked)
- "Update" button instead of "Continue"
- "Cancel" button (top left)

**Actions:**
- Edit fields + Tap "Update" → Validate + Save + Navigate back to Settings
- Tap "Cancel" → Navigate back to Settings

---

## 5. Error & Edge Case Flows

### No Internet Connection
**When:** User tries to record without internet
**Action:**
- Show toast/banner: "No internet connection. Recording will be saved locally."
- Allow recording to continue
- Show different processing screen: "Waiting for connection..."
- Retry upload when connection restored

### Microphone Permission Denied
**When:** User denies mic permission
**Action:**
- Show alert explaining why permission is needed
- Provide button to open app settings
- Show instructions on how to enable

### Notion Credentials Invalid
**When:** API calls fail due to invalid credentials
**Action:**
- Show error modal: "Notion connection failed"
- Provide "Update Credentials" button → Navigate to Notion Setup

### Recording Time Limit Reached
**When:** Timer hits 00:00
**Action:**
- Auto-stop recording
- Continue to processing (same as manual stop)
- Consider showing toast: "Maximum recording time reached"

---

## 6. Returning User Flow

### App Launch
**Scenario A: Already Configured**
- Check for stored Notion credentials
- Check for microphone permission
- Navigate directly to Main Recording Screen (Screen 4)

**Scenario B: Incomplete Setup**
- Navigate to appropriate setup screen:
  - No Notion credentials → Notion Setup (Screen 2)
  - No mic permission → Permission Screen (Screen 3)

**Scenario C: Previous Recording Exists**
- Navigate to Main Recording Screen
- Show playback button for previous recording
- Optionally: Show "Resume" banner if processing was interrupted

---

## 7. Screen Navigation Map

```
[Welcome Screen] (First Time Only)
       ↓
[Notion Setup] ←→ [Help Modal]
       ↓
[Mic Permission]
       ↓
[Main Recording] ←→ [Settings] ←→ [Update Notion]
       ↓                ↓
[Processing]      [Help Screens]
       ↓
[Success] → [View in Notion (External)]
       ↓
[Main Recording]
```

---

## 8. Data Storage Requirements

### Local Storage (AsyncStorage/SecureStore)
- `notionToken`: string (secure)
- `notionDatabaseId`: string (secure)
- `isOnboarded`: boolean
- `recordingLength`: number (10/20/30/60)
- `audioQuality`: string ("standard"/"high")
- `lastRecordingUri`: string (temporary)
- `micPermissionStatus`: string

### Temporary Files
- Audio recordings (deleted after successful upload or when new recording starts)

---

## 9. API Integration Points

### Backend Endpoints

**POST /api/transcribe**
- Request: FormData with audio file
- Response:
  ```json
  {
    "transcription": "Raw transcribed text...",
    "duration": 8.5
  }
  ```

**POST /api/polish**
- Request:
  ```json
  {
    "transcription": "Raw text..."
  }
  ```
- Response:
  ```json
  {
    "polishedText": "Clean text...",
    "title": "AI Generated Title"
  }
  ```

**POST /api/create-note**
- Request:
  ```json
  {
    "title": "Note title",
    "content": "Polished text",
    "notionApiKey": "secret_xxx",
    "databaseId": "abc123...",
    "timestamp": "2025-01-15T10:30:00Z"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "notionPageUrl": "https://notion.so/page-id",
    "pageId": "page-uuid"
  }
  ```

---

## 10. Future Enhancements (Post-MVP)

### Phase 2 Features
- **Note History Screen:** View all past recordings and transcriptions
- **Edit Transcription:** Allow editing before saving to Notion
- **Multiple Databases:** Choose destination database per recording
- **Categories/Tags:** Auto-categorize notes based on content

### Phase 3 Features
- **User Authentication:** Sign up/login with email
- **Cloud Sync:** Store recordings across devices
- **Voice Profiles:** Better transcription with speaker recognition
- **Offline Mode:** Full offline recording + queue for upload

---

## Implementation Priority

### Sprint 1 (MVP Core)
1. Main Recording Screen (Screen 4)
2. Processing Screen (Screen 5)
3. Success Screen (Screen 6)
4. Basic Settings (Screen 7)

### Sprint 2 (Onboarding)
1. Welcome Screen (Screen 1)
2. Notion Setup (Screen 2)
3. Permission Screen (Screen 3)

### Sprint 3 (Polish)
1. Error handling
2. Offline support
3. Settings enhancements
4. Playback improvements

---

## Notes for Development

- **Navigation Library:** Use React Navigation for screen management
- **State Management:** Context API or Zustand for global state (Notion creds, settings)
- **Secure Storage:** Use expo-secure-store for Notion credentials
- **Audio Management:** expo-av for recording and playback
- **API Client:** Axios for backend communication
- **Error Tracking:** Consider Sentry for production error monitoring
