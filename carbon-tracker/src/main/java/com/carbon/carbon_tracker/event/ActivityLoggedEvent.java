package com.carbon.carbon_tracker.event;

import com.carbon.carbon_tracker.entity.ActivityLog;
import org.springframework.context.ApplicationEvent;

public class ActivityLoggedEvent extends ApplicationEvent {
    private final ActivityLog activityLog;

    public ActivityLoggedEvent(Object source, ActivityLog activityLog) {
        super(source);
        this.activityLog = activityLog;
    }

    public ActivityLog getActivityLog() {
        return activityLog;
    }
}
