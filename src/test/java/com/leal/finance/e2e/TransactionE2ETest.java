/*
package com.leal.finance.e2e;

import com.leal.finance.domain.enums.TransactionType;
import com.leal.finance.dto.TransactionDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class TransactionE2ETest {

    @Autowired
    private RestTemplate restTemplate;

    @Test
    void shouldCreateTransactionAndReturn201() {
        var request = new TransactionDTO.Request("Coke", new BigDecimal("5.50"), LocalDate.now(), TransactionType.EXPENSE);

        ResponseEntity<TransactionDTO.Response> response = restTemplate.postForEntity("/api/transactions", request, TransactionDTO.Response.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody().id());
        assertEquals("Coke", response.getBody().description());
    }
}*/
