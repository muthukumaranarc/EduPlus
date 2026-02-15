# Trophy System Integration Guide

## Overview
The Trophy System has been successfully implemented in EduPlus to track and reward user engagement. This document explains how the trophy system works and how to integrate it with existing features.

## Backend Components

### Models
1. **Trophy.java** - Represents individual trophy data
   - Properties: id, name, description, icon, earned status, progress tracking
   
2. **UserTrophy.java** - Stores user-specific trophy data
   - Tracks all trophies and progress metrics for each user
   - Automatically initializes with predefined trophies

### Services
**TrophyService.java** - Handles all trophy-related business logic
- `incrementTestCompleted()` - Call when user completes a test
- `recordHighScore()` - Call when user scores 90% or above
- `updateStreak(int streak)` - Call to update study consistency
- `incrementMaterialUploaded()` - Call when user uploads study material
- `incrementMilestone()` - Call when user reaches a milestone

### Controller
**TrophyController.java** - REST endpoints at `/trophy`
- `GET /get-user-trophies` - Get current user's trophy data
- `POST /increment-test-completed` - Increment test completion count
- `POST /record-high-score` - Record a high score achievement
- `POST /update-streak` - Update consistency streak
- `POST /increment-material-uploaded` - Track material uploads
- `POST /increment-milestone` - Track milestone achievements

## Frontend Components

### Pages
**Trophies.jsx** - Main trophy display page
- Shows earned and locked trophies
- Displays progress for each trophy
- Category filtering (All, Tests, Scores, Consistency, Contributions, Milestones)
- Statistics overview

### Routing
- Route: `/home/trophies`
- Navigation button added to main menu

## Trophy Types

### 1. Test Completion Trophies
- **Beginner** 🏅 - Complete 1 test
- **Learner** 🎖️ - Complete 5 tests
- **Achiever** 🏆 - Complete 10 tests

### 2. High Score Trophy
- **Excellence** ⭐ - Score 90% or above in a test

### 3. Consistency Trophy
- **Consistency** 🔥 - Study for 5 consecutive days

### 4. Contribution Trophy
- **Contributor** 📚 - Upload study material

### 5. Milestone Trophies
- **Bronze Milestone** 🥉 - Reach 5 milestones
- **Silver Milestone** 🥈 - Reach 10 milestones
- **Gold Milestone** 🥇 - Reach 20 milestones

## Integration Instructions

### 1. Test Completion Integration

When a user completes a test, add this code:

```javascript
// Frontend (after test submission)
await axios.post(`${baseURL}/trophy/increment-test-completed`, {}, {
    withCredentials: true
});
```

Or in the backend (TestService.java):

```java
@Autowired
private TrophyService trophyService;

public void submitTest(Test test) {
    // ... existing test submission logic ...
    
    // Increment trophy progress
    trophyService.incrementTestCompleted();
}
```

### 2. High Score Integration

When a test score is calculated and is 90% or above:

```javascript
// Frontend
if (scorePercentage >= 90) {
    await axios.post(`${baseURL}/trophy/record-high-score`, {}, {
        withCredentials: true
    });
}
```

Or in backend:

```java
public void calculateScore(TestResult result) {
    // ... calculate score ...
    
    if (scorePercentage >= 90) {
        trophyService.recordHighScore();
    }
}
```

### 3. Study Streak Integration

Track daily logins and update streak:

```javascript
// Frontend - on daily login
const streak = calculateStreak(); // Your streak calculation logic
await axios.post(`${baseURL}/trophy/update-streak`, 
    { streak: streak }, 
    { withCredentials: true }
);
```

### 4. Material Upload Integration

When user uploads study materials:

```javascript
// Frontend - after successful upload
await axios.post(`${baseURL}/trophy/increment-material-uploaded`, {}, {
    withCredentials: true
});
```

### 5. Milestone Integration

Define what constitutes a milestone in your app, then:

```javascript
// Frontend - when milestone is reached
await axios.post(`${baseURL}/trophy/increment-milestone`, {}, {
    withCredentials: true
});
```

## Example: Complete Test Flow

```javascript
const submitTest = async (testAnswers) => {
    try {
        // Submit test
        const response = await axios.post(`${baseURL}/test/submit`, testAnswers, {
            withCredentials: true
        });
        
        const score = response.data.score;
        const totalQuestions = response.data.totalQuestions;
        const percentage = (score / totalQuestions) * 100;
        
        // Update trophy progress for test completion
        await axios.post(`${baseURL}/trophy/increment-test-completed`, {}, {
            withCredentials: true
        });
        
        // Check for high score
        if (percentage >= 90) {
            await axios.post(`${baseURL}/trophy/record-high-score`, {}, {
                withCredentials: true
            });
        }
        
        // Show results to user
        showTestResults(score, totalQuestions);
        
    } catch (error) {
        console.error('Error submitting test:', error);
    }
};
```

## Viewing Trophy Progress

Users can view their trophy progress by:
1. Clicking the "Trophies" button in the navigation menu
2. Navigating to `/home/trophies`

The trophy page displays:
- Total trophies earned
- Completion percentage
- Tests completed count
- Current study streak
- Individual trophy cards with progress bars
- Category filters for easy navigation

## Database Schema

The trophy data is stored in MongoDB collection `userTrophies`:

```json
{
    "_id": "username",
    "username": "user123",
    "trophies": [
        {
            "id": "beginner",
            "name": "Beginner",
            "description": "Complete your first test",
            "icon": "🏅",
            "earned": true,
            "earnedDate": "2026-02-15 10:30:00",
            "currentProgress": 1,
            "requiredProgress": 1,
            "category": "test"
        }
        // ... more trophies
    ],
    "testsCompleted": 1,
    "highScoreCount": 0,
    "currentStreak": 0,
    "materialsUploaded": 0,
    "milestonesReached": 0
}
```

## Future Enhancements

Consider adding:
1. Trophy notifications when earned
2. Social sharing of trophies
3. Leaderboards based on trophy counts
4. Special rewards for earning all trophies
5. Seasonal or event-based trophies
6. Trophy rarity levels (common, rare, legendary)

## Troubleshooting

### Trophies not updating
- Ensure backend endpoints are being called after relevant actions
- Check browser console for API errors
- Verify user is authenticated (withCredentials: true)

### Progress not showing correctly
- Refresh the trophy page to fetch latest data
- Check that the correct progress metric is being incremented

### Backend compilation errors
- Ensure all Java files are in correct package structure
- Verify MongoDB connection is working
- Check that TrophyRepo is properly autowired in TrophyService
