package com.leal.finance.domain;

import com.leal.finance.domain.enums.TransactionType;
import com.leal.finance.services.exception.DataIntegrityException;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String description;

    private BigDecimal amount;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // INCOME (Receita) ou EXPENSE (Despesa)

    public Transaction() {
    }

    public Transaction(String description, BigDecimal amount, LocalDate date, TransactionType type) {
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public void updateDescription(String newDescription) {
        if (newDescription == null || newDescription.isBlank()) {
            throw new DataIntegrityException("Descrição não pode ser vazia.");
        }
        this.description = newDescription;
    }
}
