package com.carbon.carbon_tracker.dto;

public class LeaderboardEntryResponse {
    private int rank;
    private String name;
    private String badge;
    private long score;

    public LeaderboardEntryResponse(int rank, String name, String badge, long score) {
        this.rank = rank;
        this.name = name;
        this.badge = badge;
        this.score = score;
    }

    public int getRank() { return rank; }
    public String getName() { return name; }
    public String getBadge() { return badge; }
    public long getScore() { return score; }
}
