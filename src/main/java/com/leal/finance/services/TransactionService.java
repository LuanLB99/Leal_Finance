package com.leal.finance.services;

import com.leal.finance.domain.Transaction;
import com.leal.finance.dto.TransactionDTO;
import com.leal.finance.repository.TransactionRepository;
import com.leal.finance.services.exception.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repository;


    public Transaction findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ObjectNotFoundException(
                "Objeto não encontrado! Id: " + id + ", Tipo: " + Transaction.class.getName()));
    }

    @Transactional
    public Transaction create(TransactionDTO.Request requestDTO) {
        Transaction transaction = TransactionDTO.Request.toEntity(requestDTO);
        return repository.save(transaction);
    }
}
