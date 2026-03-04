package com.leal.finance.units;

import com.leal.finance.domain.Transaction;
import com.leal.finance.domain.enums.TransactionType;
import com.leal.finance.dto.TransactionDTO;
import com.leal.finance.repository.TransactionRepository;
import com.leal.finance.services.TransactionService;
import com.leal.finance.services.exception.ObjectNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @InjectMocks
    private TransactionService service;

    @Test
    void shouldCreateTransactionSuccessfully() {
        // Arrange
        TransactionDTO.Request request = new TransactionDTO.Request("Freelance", new BigDecimal("150.00"), LocalDate.now(), TransactionType.INCOME);
        Transaction transaction = TransactionDTO.Request.toEntity(request);
        when(repository.save(any(Transaction.class))).thenReturn(transaction);

        // Act
        Transaction result = service.create(request);

        // Assert
        assertNotNull(result);
        assertEquals("Freelance", result.getDescription());
        verify(repository, times(1)).save(any());
    }

    @Test
    void shouldThrowExceptionWhenIdNotFound() {
        when(repository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ObjectNotFoundException.class, () -> service.findById(1));
    }


}
