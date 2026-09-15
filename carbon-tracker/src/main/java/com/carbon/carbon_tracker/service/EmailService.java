package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.entity.Goal;
import com.carbon.carbon_tracker.entity.User;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:support@ecotrack.com}")
    private String fromEmail;

    @Async
    public void sendGoalCreatedEmail(User user, Goal goal) {
        if (!shouldSendEmail(user)) return;

        String subject = "🎯 New Sustainability Goal Activated — " + goal.getTargetReductionPercentage() + "% Carbon Reduction";
        String htmlContent = buildEmailTemplate(
            "New Goal Created!",
            "Hello " + user.getName() + ",<br><br>" +
            "You have set a new sustainability goal to reduce your carbon footprint by <strong>" + 
            goal.getTargetReductionPercentage() + "%</strong>.<br>" +
            "Target threshold: <strong>" + goal.getTargetValue() + " kg CO₂e</strong>.<br>" +
            "Timeline: from <strong>" + goal.getStartDate() + "</strong> to <strong>" + goal.getEndDate() + "</strong>.<br><br>" +
            "Track your everyday activities to monitor your real-time progress!",
            "#16a34a"
        );

        sendEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    public void sendGoalProgressMilestoneEmail(User user, Goal goal, int percentage) {
        if (!shouldSendEmail(user)) return;

        String subject = "🚀 Goal Progress Update: " + percentage + "% Towards Your Target!";
        String htmlContent = buildEmailTemplate(
            "Great Progress!",
            "Hello " + user.getName() + ",<br><br>" +
            "Awesome job! You have reached <strong>" + percentage + "%</strong> progress towards your goal of " +
            "<strong>" + goal.getTargetReductionPercentage() + "% reduction</strong>.<br><br>" +
            "Keep logging low-carbon travel, plant-based meals, and energy savings to hit 100%!",
            "#2563eb"
        );

        sendEmail(user.getEmail(), subject, htmlContent);
    }

    @Async
    public void sendGoalCompletedEmail(User user, Goal goal) {
        if (!shouldSendEmail(user)) return;

        String subject = "🎉 Congratulations! You Achieved Your Sustainability Goal!";
        String htmlContent = buildEmailTemplate(
            "Goal 100% Completed! 🏆",
            "Hello " + user.getName() + ",<br><br>" +
            "Fantastic news! You have successfully achieved your <strong>" + 
            goal.getTargetReductionPercentage() + "% carbon reduction goal</strong>.<br><br>" +
            "Your conscious choices made a measurable positive impact on our planet. Check your profile to view your new badges and leaderboard ranking!",
            "#ea580c"
        );

        sendEmail(user.getEmail(), subject, htmlContent);
    }

    private boolean shouldSendEmail(User user) {
        if (user == null || user.getEmail() == null) return false;
        if (user.getEmailAlerts() != null && !user.getEmailAlerts()) {
            logger.info("User {} has disabled email alerts in profile preferences. Skipping email.", user.getEmail());
            return false;
        }
        return true;
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        logger.info("\n============================================================\n" +
                    "📧 [EMAIL NOTIFICATION DISPATCHED]\n" +
                    "To: {}\n" +
                    "Subject: {}\n" +
                    "============================================================", toEmail, subject);

        if (mailSender == null) {
            logger.info("JavaMailSender is not configured in properties. Logged notification to console above.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "EcoTrack Sustainability");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Successfully delivered email to {}", toEmail);
        } catch (Exception e) {
            logger.warn("Could not deliver SMTP email to {} (Fallback active): {}", toEmail, e.getMessage());
        }
    }

    private String buildEmailTemplate(String headerTitle, String bodyMessage, String brandColor) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head><meta charset='UTF-8'></head>" +
               "<body style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc;'>" +
               "  <div style='max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>" +
               "    <div style='background-color: " + brandColor + "; padding: 24px; text-align: center; color: #ffffff;'>" +
               "      <h1 style='margin: 0; font-size: 24px; font-weight: 800;'>🌍 EcoTrack</h1>" +
               "      <p style='margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;'>" + headerTitle + "</p>" +
               "    </div>" +
               "    <div style='padding: 32px 24px; color: #334155; font-size: 15px; line-height: 1.6;'>" +
               "      " + bodyMessage + "" +
               "      <div style='margin-top: 32px; text-align: center;'>" +
               "        <a href='http://localhost:5173/goals' style='background-color: " + brandColor + "; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; display: inline-block;'>View Your Goals Dashboard</a>" +
               "      </div>" +
               "    </div>" +
               "    <div style='background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;'>" +
               "      EcoTrack Sustainability Platform • You received this because email notifications are enabled on your account." +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }
}
