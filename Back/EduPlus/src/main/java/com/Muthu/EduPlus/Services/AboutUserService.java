package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.AboutUser;
import com.Muthu.EduPlus.Repositories.AboutUserRepo;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AboutUserService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AboutUserRepo aboutUserRepo;

    public void changeUsername(String username){
        String currentName = SecurityContextHolder.getContext().getAuthentication().getName();
        AboutUser info = aboutUserRepo.findByUsername(currentName);
        info.setUsername(username);
        aboutUserRepo.save(info);
        aboutUserRepo.deleteById(currentName);
    }

    public void createUserData(String username, String name){
        try {
            List<String> info = new ArrayList<String>();
            info.add("Name: " + name);
            aboutUserRepo.save(new AboutUser(username, info));
            System.out.println("User data is created");
        } catch (Exception e) {
            System.out.println("Error from About: " + e.getMessage());
        }
    }

    public List<String> getUserdata() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AboutUser data = aboutUserRepo.findByUsername(username);
        return data.getData();
    }

    public String getUserDataInString(){
        return String.join(";", getUserdata());
    }

    public void addData(String info) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AboutUser data = aboutUserRepo.findByUsername(username);
        List<String> userData = data.getData();
        userData.add(info);
        data.setData(userData);
        aboutUserRepo.save(data);
    }

    public boolean removeData(String info) {
        AboutUser data = aboutUserRepo.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        List<String> userData = data.getData();
        boolean res = userData.remove(info);
        if(!res) return false;
        data.setData(userData);
        aboutUserRepo.save(data);
        return true;
    }

     public boolean replaceData(String oldInfo, String newInfo) {
        AboutUser data = aboutUserRepo.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        List<String> info = data.getData();
        int index = info.indexOf(oldInfo);
        if(index == -1) return false;
        info.set(index, newInfo);
        data.setData(info);
        aboutUserRepo.save(data);
        return true;
     }

     public void removeAboutUser(String username) {
        aboutUserRepo.deleteById(username);
     }

     public void deleteAll() {
        aboutUserRepo.deleteAll();
     }
}
