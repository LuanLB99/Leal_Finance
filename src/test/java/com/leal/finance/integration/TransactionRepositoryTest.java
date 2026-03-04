package com.leal.finance.integration;

import com.leal.finance.domain.Transaction;
import com.leal.finance.domain.enums.TransactionType;
import com.leal.finance.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository repository;

    @Test
    void shouldSaveAndLoadFromPostgres() {
        Transaction t = new Transaction("Internet", new BigDecimal("100.00"), LocalDate.now(), TransactionType.EXPENSE);

        Transaction saved = repository.save(t);
        Optional<Transaction> found = repository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals(new BigDecimal("100.00"), found.get().getAmount());
    }
}
