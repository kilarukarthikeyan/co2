package com.carbon.carbon_tracker.event;

import com.carbon.carbon_tracker.service.BadgeService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class BadgeAwardingListener {
    private final BadgeService badgeService;

    public BadgeAwardingListener(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @EventListener
    public void handleActivityLoggedEvent(ActivityLoggedEvent event) {
        badgeService.checkAndAwardBadges(event.getActivityLog().getUser());
    }
}
