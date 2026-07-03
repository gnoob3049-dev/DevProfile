---
Task ID: 2
Agent: Frontend Developer
Task: Create all frontend components and pages for DevProfile

Files Created:
- src/store/app-store.ts - Zustand store with routing, auth, profile, github data
- src/lib/api.ts - API client wrapper with auth, profile, github, developers, follow, endorse endpoints
- src/components/shared/Navbar.tsx - Sticky glassmorphism navbar with nav links, mobile menu, dark mode toggle
- src/components/shared/Footer.tsx - Simple footer with branding
- src/components/shared/GitHubStatsCard.tsx - 4-stat grid (repos, followers, following, stars)
- src/components/shared/RepoCard.tsx - Repository card with language color dot and stars
- src/components/shared/LanguageChart.tsx - Horizontal bar chart using recharts
- src/components/shared/EndorsementsSection.tsx - Skill endorsements with click-to-endorse
- src/components/shared/DeveloperCard.tsx - Developer card for explore/landing with follow button
- src/components/shared/SkillChips.tsx - Multi-select skill picker with colored chips
- src/components/shared/ProfileHeader.tsx - Full profile header with avatar, info, follow, share
- src/components/pages/LandingPage.tsx - Hero + stats + featured developers
- src/components/pages/RegisterPage.tsx - Registration form with validation
- src/components/pages/LoginPage.tsx - Login form with validation
- src/components/pages/OnboardingPage.tsx - Profile setup with skills, looking-for
- src/components/pages/MyProfilePage.tsx - Own profile with GitHub data, repos, languages, heatmap, endorsements
- src/components/pages/PublicProfilePage.tsx - Public profile view with follow/endorse
- src/components/pages/ExplorePage.tsx - Search, filter, paginated developer grid
- src/components/pages/EditProfilePage.tsx - Profile edit form
- src/components/pages/FollowingPage.tsx - Followers/following list

Files Modified:
- src/app/layout.tsx - Added ThemeProvider (dark default), updated metadata
- src/app/page.tsx - Client-side router with framer-motion transitions

Status: Complete. ESLint clean, dev server compiling successfully.