package com.leal.finance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.leal.finance.domain.Transaction;
import com.leal.finance.domain.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {

    public record Request(
            @NotBlank String description,
            @NotNull @Positive BigDecimal amount,
            @NotNull(message = "A data da transação deve ser preenchida") @JsonFormat(pattern = "dd/MM/yyyy") LocalDate date,
            @NotNull TransactionType type
    ) {
        public static Transaction toEntity(Request request) {
            return new Transaction(request.description(), request.amount(), request.date(), request.type());
        }
    }

    public record Response(
            Integer id,
            String description,
            BigDecimal amount,
            LocalDate date,
            TransactionType type
    ) {
        public static Response fromEntity(Transaction t) {
            return new Response(t.getId(), t.getDescription(), t.getAmount(), t.getDate(), t.getType());
        }
    }
}
