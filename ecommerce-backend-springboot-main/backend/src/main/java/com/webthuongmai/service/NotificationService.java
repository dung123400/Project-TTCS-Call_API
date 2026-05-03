package com.webthuongmai.service;
import com.webthuongmai.dto.NotificationDTO;
import com.webthuongmai.entity.Notification;
import com.webthuongmai.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByReceiver_UserIDOrderByCreatedAtDesc(userId);

        List<NotificationDTO> dtoList = new ArrayList<>();

        for (Notification notif : notifications) {
            NotificationDTO dto = new NotificationDTO();
            dto.setNotificationId(notif.getNotificationID());
            dto.setType(notif.getType());
            dto.setTitle(notif.getTitle());
            dto.setContent(notif.getContent());
            dto.setIsRead(notif.getIsRead());
            dto.setCreatedAt(notif.getCreatedAt());

            dtoList.add(dto);
        }

        return dtoList;
    }
}