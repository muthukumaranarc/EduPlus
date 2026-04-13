package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Services.TestService;
import com.Muthu.EduPlus.Services.TrophyService;
import com.Muthu.EduPlus.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Random;

@RestController
public class MockDataController {

    @Autowired
    private UserService userService;

    @Autowired
    private TrophyService trophyService;

    @Autowired
    private com.Muthu.EduPlus.Repositories.TrophyRepo trophyRepo;

    @Autowired
    private com.Muthu.EduPlus.Repositories.TestRepo testRepo;

    @GetMapping("/generate-mock-data")
    public String generateMockData() {
        // We will ignore auth for this endpoint in AuthConfiguration.java.
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return "No users found in DB. Create some users first!";
        }

        Random rand = new Random();
        for (User user : users) {
             String username = user.getUsername();
             com.Muthu.EduPlus.Models.UserTest userTest = testRepo.findById(username).orElse(null);
             if (userTest == null) {
                 userTest = new com.Muthu.EduPlus.Models.UserTest(username, new java.util.ArrayList<>());
             }
             if (userTest.getTestGroup() == null) {
                 userTest.setTestGroup(new java.util.ArrayList<>());
             }

             // Generate mock tests for different topics
             String[] topics = {"Biology Basics", "Space Physics", "History Timeline", "Algebra Concepts", "Chemistry Elements"};
             int testCount = rand.nextInt(4) + 1; // 1 to 4 tests
             
             for (int i=0; i<testCount; i++) {
                 String group = topics[i];
                 String testName = "Chapter " + (rand.nextInt(5) + 1);
                 
                 // make sure the group exists
                 com.Muthu.EduPlus.Models.TestGroup testGroup = null;
                 for (com.Muthu.EduPlus.Models.TestGroup tg : userTest.getTestGroup()) {
                     if (tg.getName().equals(group)) {
                         testGroup = tg; break;
                     }
                 }
                 if (testGroup == null) {
                     testGroup = new com.Muthu.EduPlus.Models.TestGroup(new java.util.ArrayList<>(), group);
                     userTest.getTestGroup().add(testGroup);
                 }
                 if (testGroup.getGroup() == null) {
                     testGroup.setGroup(new java.util.ArrayList<>());
                 }
                 
                 // make sure the test exists
                 com.Muthu.EduPlus.Models.Test theTest = null;
                 for (com.Muthu.EduPlus.Models.Test t : testGroup.getGroup()) {
                     if (t.getTitle().equals(testName)) {
                         theTest = t; break;
                     }
                 }
                 if (theTest == null) {
                     theTest = new com.Muthu.EduPlus.Models.Test(testName, new java.util.ArrayList<>());
                     // Add some mock questions
                     com.Muthu.EduPlus.Models.Question q1 = new com.Muthu.EduPlus.Models.Question();
                     q1.setQuestion("What is the main topic of " + group + "?");
                     q1.setType("MCQ");
                     q1.setOptions(java.util.List.of("Option A", "Option B", "Option C", "Option D"));
                     q1.setAnswer("Option A");
                     
                     com.Muthu.EduPlus.Models.Question q2 = new com.Muthu.EduPlus.Models.Question();
                     q2.setQuestion("Explain " + group + " briefly.");
                     q2.setType("TWO_MARKS");
                     q2.setAnswer("This is a model answer.");
                     
                     theTest.setQuestionSet(java.util.List.of(q1, q2));
                     testGroup.getGroup().add(theTest);
                 }
             }
             testRepo.save(userTest);

             com.Muthu.EduPlus.Models.UserTrophy userTrophy = trophyService.getUserTrophiesByUsername(username);

             // Add a random number of test completions
             int testsTaken = rand.nextInt(5) + 1;
             userTrophy.setTestsCompleted(userTrophy.getTestsCompleted() + testsTaken);

             // Add some high scores
             int highScores = rand.nextInt(3);
             userTrophy.setHighScoreCount(userTrophy.getHighScoreCount() + highScores);

             // Add some materials uploaded
             int uploads = rand.nextInt(4);
             userTrophy.setMaterialsUploaded(userTrophy.getMaterialsUploaded() + uploads);
             
             // Update logic
             try {
                 java.lang.reflect.Method m = TrophyService.class.getDeclaredMethod("checkAndAwardTrophies", com.Muthu.EduPlus.Models.UserTrophy.class);
                 m.setAccessible(true);
                 m.invoke(trophyService, userTrophy);
                 
                 java.lang.reflect.Method m2 = TrophyService.class.getDeclaredMethod("syncTrophyCountToUser", com.Muthu.EduPlus.Models.UserTrophy.class);
                 m2.setAccessible(true);
                 m2.invoke(trophyService, userTrophy);
                 
                 trophyRepo.save(userTrophy);
             } catch (Exception e) {
                 e.printStackTrace();
             }
        }
        
        return "Mock data created for " + users.size() + " users!";
    }
}
