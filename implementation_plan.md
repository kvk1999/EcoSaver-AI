# Implementation Plan - EcoStep Carbon Footprint Platform

A premium, interactive web application to help individuals understand, track, and reduce their carbon footprint through simple actions, gamified incentives, an AI chatbot, and a personalized onboarding/consultation system.

## Proposed Features

1.  **Modern Dashboard & Interactive Calculator**:
    *   Multi-step carbon footprint calculator (Home Energy, Travel, Food, Consumption).
    *   Beautiful data visualization using Chart.js (Carbon breakdown doughnut chart, historical savings line chart).
    *   Real-time data synchronization with standard emission factors.

2.  **Interactive AI Chatbot ("EcoBot")**:
    *   Sleek chat interface with floating trigger or dashboard integration.
    *   Rich interactive replies: custom carbon recommendations, environmental trivia, habit reminders, and a quick Q&A database.
    *   Suggests daily actions directly inside the chat window.

3.  **Advanced Leveling System (100+ Levels)**:
    *   Users earn Experience Points (XP) by logging daily eco-actions, completing quizzes, and achieving milestones.
    *   Level calculation using a logarithmic/geometric scale `Level = floor(sqrt(XP / 50)) + 1` supporting 100+ levels.
    *   Milestone rewards (e.g., Level 10: "Sapling", Level 50: "Eco-Warrior", Level 100+: "Gaia Guardian").
    *   Dynamic progress bar with percentage animation and confetti effects on level-up.

4.  **Customer consultation/onboarding Application Form**:
    *   Multi-step application for personalized eco-audits or green community membership.
    *   Collects contact info, energy profiles, budget constraints, and sustainability goals.
    *   Generates a downloadable PDF-like report of their initial assessment upon submission.

5.  **Aesthetics & Premium Styling**:
    *   Deep dark glassmorphism theme (`#080F0A` base, vibrant neon emerald `#10B981` accents, soft cyan highlights).
    *   Micro-interactions, smooth hover transitions, custom range-slider animations.
    *   Highly responsive, clean UI using Google Font "Outfit".

## Proposed Changes

We will create a self-contained, high-fidelity single-page web app in the workspace.

### Frontend Implementation

#### [NEW] [index.html](file:///d:/Guvi%20FS%20Programs/virtualpromptwar/index.html)
- Standard HTML5 structures for all sections.
- Embedded scripts for Lucide Icons, Chart.js, and Confetti effects.
- Main layout divided into Dashboard, Actions Tracker, AI Chatbot, Application Form, and Leaderboard/Levels tab.

#### [NEW] [style.css](file:///d:/Guvi%20FS%20Programs/virtualpromptwar/style.css)
- Premium CSS styles.
- CSS Variable definitions for HSL color tokens.
- Custom animation keyframes for level-ups, toast messages, and chatbot message bubbles.

#### [NEW] [app.js](file:///d:/Guvi%20FS%20Programs/virtualpromptwar/app.js)
- Carbon calculation formulas.
- Leveling algorithm & state manager (saves state to `localStorage`).
- Interactive simulated chatbot system with preset query handling and keyword matching.
- Form handler creating downloadable assessment summaries.

## Verification Plan

### Automated Tests
- Since this is a lightweight vanilla JS web application, we will verify correctness using manual functional testing and browser console logging.

### Manual Verification
- **Level Scaling**: Verify XP increases transition correctly through levels (especially verifying levels scaling beyond 100 using a debug XP boosting button).
- **Calculator**: Test travel (flight/car mileage) inputs and check for mathematical consistency in CO2 outputs.
- **Chatbot**: Verify keyword triggers (e.g., "flight", "meat", "plastic", "offset") and custom message responses.
- **Application Form**: Verify validation states and check that submission correctly renders a printable summary card.
- **Responsive Layout**: Test screen sizes from mobile width up to desktop size.
