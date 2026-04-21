package com.webthuongmai.controller;
import com.webthuongmai.entity.Notification;
import com.webthuongmai.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAllNotifications();
    }

    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return notificationService.createNotification(notification);
    }
}