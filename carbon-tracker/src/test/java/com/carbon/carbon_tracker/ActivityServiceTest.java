package com.carbon.carbon_tracker;

import com.carbon.carbon_tracker.dto.ActivityRequest;
import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.entity.EmissionFactor;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.EmissionFactorRepository;
import com.carbon.carbon_tracker.repository.UserRepository;
import com.carbon.carbon_tracker.service.ActivityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ActivityServiceTest {

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private EmissionFactorRepository emissionFactorRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private ActivityService activityService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogActivity_Success() {
        User user = new User();
        user.setEmail("user@example.com");

        EmissionFactor factor = new EmissionFactor();
        factor.setCategory("Transport");
        factor.setActivityType("Car");
        factor.setUnit("km");
        factor.setFactorValue(BigDecimal.valueOf(0.2));

        ActivityRequest request = new ActivityRequest();
        request.setCategory("Transport");
        request.setActivityType("Car");
        request.setUnit("km");
        request.setQuantity(BigDecimal.valueOf(50));
        request.setLogDate(LocalDate.now());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(emissionFactorRepository.findByCategoryAndActivityTypeAndUnit("Transport", "Car", "km"))
                .thenReturn(Optional.of(factor));
        when(activityLogRepository.save(any(ActivityLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ActivityLog result = activityService.logActivity("user@example.com", request);

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(10.0), result.getCalculatedCo2e()); // 50 * 0.2
        verify(eventPublisher, times(1)).publishEvent(any());
    }

    @Test
    void testLogActivity_ZeroQuantity() {
        User user = new User();
        user.setEmail("user@example.com");

        EmissionFactor factor = new EmissionFactor();
        factor.setCategory("Transport");
        factor.setActivityType("Car");
        factor.setUnit("km");
        factor.setFactorValue(BigDecimal.valueOf(0.2));

        ActivityRequest request = new ActivityRequest();
        request.setCategory("Transport");
        request.setActivityType("Car");
        request.setUnit("km");
        request.setQuantity(BigDecimal.ZERO);
        request.setLogDate(LocalDate.now());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(emissionFactorRepository.findByCategoryAndActivityTypeAndUnit("Transport", "Car", "km"))
                .thenReturn(Optional.of(factor));
        when(activityLogRepository.save(any(ActivityLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ActivityLog result = activityService.logActivity("user@example.com", request);

        assertEquals(BigDecimal.ZERO, result.getCalculatedCo2e().stripTrailingZeros());
    }

    @Test
    void testLogActivity_UnknownActivityType() {
        User user = new User();
        user.setEmail("user@example.com");

        ActivityRequest request = new ActivityRequest();
        request.setCategory("Transport");
        request.setActivityType("RocketShip");
        request.setUnit("km");
        request.setQuantity(BigDecimal.valueOf(10));

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(emissionFactorRepository.findByCategoryAndActivityTypeAndUnit(anyString(), anyString(), anyString()))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            activityService.logActivity("user@example.com", request);
        });
    }

    @ParameterizedTest
    @CsvSource({
        "Transport, Car, km, 10, 0.2, 2.0",
        "Electricity, Grid, kWh, 100, 0.45, 45.0",
        "Food, Vegan Meal, servings, 3, 0.4, 1.2"
    })
    void testLogActivity_Parameterized(String category, String type, String unit, double quantity, double factorVal, double expectedCo2) {
        User user = new User();
        user.setEmail("user@example.com");

        EmissionFactor factor = new EmissionFactor();
        factor.setCategory(category);
        factor.setActivityType(type);
        factor.setUnit(unit);
        factor.setFactorValue(BigDecimal.valueOf(factorVal));

        ActivityRequest request = new ActivityRequest();
        request.setCategory(category);
        request.setActivityType(type);
        request.setUnit(unit);
        request.setQuantity(BigDecimal.valueOf(quantity));
        request.setLogDate(LocalDate.now());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(emissionFactorRepository.findByCategoryAndActivityTypeAndUnit(category, type, unit))
                .thenReturn(Optional.of(factor));
        when(activityLogRepository.save(any(ActivityLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ActivityLog result = activityService.logActivity("user@example.com", request);

        assertEquals(BigDecimal.valueOf(expectedCo2).stripTrailingZeros(), result.getCalculatedCo2e().stripTrailingZeros());
    }
}
