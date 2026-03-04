package com.leal.finance.resources;

import com.leal.finance.dto.TransactionDTO;
import com.leal.finance.services.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionResource {

    @Autowired
    private TransactionService service;

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO.Response> findById(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(TransactionDTO.Response.fromEntity(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<TransactionDTO.Response> create(@RequestBody @Valid TransactionDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(TransactionDTO.Response.fromEntity(service.create(request)));
    }
}
