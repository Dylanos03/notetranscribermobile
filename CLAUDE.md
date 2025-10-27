# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **mobile frontend** for a Voice-to-Notion application that records voice notes, transcribes them using OpenAI Whisper, polishes the text with GPT-4o-mini, and automatically creates formatted notes in Notion. This is an Expo/React Native mobile app that communicates with a separate Node.js + Express backend.

**Key architectural note:** The MVP.md document originally described this as a web app, but the implementation is now a mobile app using Expo and React Native instead.

## Technology Stack

- **Framework:** Expo ~54.0.20
- **React:** 19.1.0
- **React Native:** 0.81.5
- **New Architecture:** Enabled (see app.json)
- **Platforms:** iOS, Android, Web

## Development Commands

### Running the App
```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Installation
```bash
npm install
```

## Project Structure

```
mobile/
├── App.js              # Main application entry point
├── index.js            # Expo entry file
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── assets/             # Images, icons, splash screens
└── MVP.md             # Product requirements and roadmap
```

## Architecture Overview

### Backend Integration
This mobile app is designed to communicate with a separate Node.js + Express backend that provides:
- `POST /api/transcribe` - Uploads audio and returns transcription
- `POST /api/create-note` - Sends polished text to Notion

The backend handles:
- OpenAI Whisper API integration for transcription
- GPT-4o-mini for text polishing
- Notion API integration for creating pages

### MVP Features (Phase 1)
1. **Voice Recording:** Large record button, max 5 minutes, visual recording indicator
2. **Transcription:** OpenAI Whisper API (English only)
3. **AI Polishing:** Remove filler words, fix grammar, organize into paragraphs, generate title
4. **Notion Integration:** Create pages in user-specified database with title, body, timestamp
5. **Setup Flow:** User provides Notion API key and Database ID (stored in local storage)

### What's NOT in MVP
- No MCP integration
- No user accounts/authentication
- No editing before saving
- No voice note history
- No multiple language support
- No note categorization

## Key Implementation Details

### Audio Recording
- Browser-based recording using React Native audio APIs
- Maximum recording length: 5 minutes
- Need visual feedback (waveform or pulsing animation)

### State Management
- Notion credentials stored in AsyncStorage (or similar local storage)
- No global state management library required for MVP

### API Communication
- Use axios for HTTP requests to backend (as specified in MVP.md)
- Handle loading states: "Transcribing...", "Polishing...", "Saving to Notion..."
- Display success message with link to created Notion page

### User Flow
1. Landing/setup page → Enter Notion credentials → Save to local storage
2. Main screen → Press record button → Record voice
3. Stop recording → Show processing states → Display success/error
4. Option to "Record Another Note"

## Development Workflow

### Adding New Dependencies
```bash
npx expo install <package-name>
```
Use `npx expo install` instead of `npm install` for React Native packages to ensure version compatibility.

### Testing on Physical Devices
Use the Expo Go app on iOS/Android to scan the QR code from `npm start` for rapid testing.

### Building for Production
Refer to Expo documentation for building standalone apps using EAS Build.

## Backend API Assumptions

When implementing API calls, assume the backend endpoints follow this structure:

**POST /api/transcribe**
- Request: FormData with audio file
- Response: `{ transcription: string }`

**POST /api/create-note**
- Request: `{ polishedText: string, title: string, notionApiKey: string, databaseId: string }`
- Response: `{ success: boolean, notionPageUrl: string }`

## Post-MVP Roadmap

See MVP.md for detailed phases. Key future features:
- Phase 2: Edit transcription, multiple databases, auto-categorization, note history
- Phase 3: MCP integration, user authentication, team workspaces, multiple languages
- Phase 4: Monetization, advanced AI features, integrations with other tools

## Cost Considerations

API costs per note (backend):
- Whisper: ~$0.006/minute
- GPT-4o-mini: ~$0.0001/note
- Notion: Free

Target: Keep per-user costs low to validate demand before monetization.

## Success Metrics for MVP

Track in analytics:
1. Activation rate (% who complete setup)
2. Usage frequency (notes per user per week)
3. Retention (% return after first use)
4. Time saved vs manual typing

**MVP Goal:** 100 users creating 10+ notes each within first month

## Important Configuration Notes

- **New Architecture Enabled:** This Expo app uses React Native's new architecture (see app.json line 9)
- **Platform Support:** Configured for iOS (tablets supported), Android (edge-to-edge), and Web
- **Orientation:** Portrait only (can be changed in app.json)

## Timeline Reference

Original MVP timeline (from MVP.md):
- Days 1-2: Frontend (recording UI + setup flow)
- Days 3-4: Backend (transcription + LLM polishing)
- Day 5: Notion integration
- Day 6: Testing
- Day 7: Deploy

Total: ~1 week for solo developer
