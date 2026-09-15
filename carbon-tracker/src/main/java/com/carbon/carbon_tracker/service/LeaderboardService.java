package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.dto.LeaderboardEntryResponse;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.entity.UserBadge;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.UserBadgeRepository;
import com.carbon.carbon_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LeaderboardService {
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserBadgeRepository userBadgeRepository;

    public LeaderboardService(UserRepository userRepository, ActivityLogRepository activityLogRepository, UserBadgeRepository userBadgeRepository) {
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.userBadgeRepository = userBadgeRepository;
    }

    public List<LeaderboardEntryResponse> getLeaderboard() {
        Map<Long, BigDecimal> totalsByUserId = new HashMap<>();
        for (Object[] row : activityLogRepository.sumCalculatedCo2eGroupByUser()) {
            totalsByUserId.put((Long) row[0], (BigDecimal) row[1]);
        }

        List<User> users = userRepository.findAll();
        users.sort(Comparator.comparing(u -> totalsByUserId.getOrDefault(u.getId(), BigDecimal.ZERO)));

        List<LeaderboardEntryResponse> leaderboard = new ArrayList<>();
        int rank = 1;
        for (User user : users) {
            BigDecimal total = totalsByUserId.getOrDefault(user.getId(), BigDecimal.ZERO);
            long score = Math.max(0, 1000 - total.longValue());

            List<UserBadge> badges = userBadgeRepository.findByUserId(user.getId());
            String badgeName = badges.isEmpty() ? "Newcomer" : badges.get(badges.size() - 1).getBadge().getName();

            leaderboard.add(new LeaderboardEntryResponse(rank++, user.getName(), badgeName, score));
        }
        return leaderboard;
    }
}
