package com.leal.finance.exception;

import java.io.Serial;
import java.io.Serializable;

public class FieldMessage implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String fieldName;
    private String message;
    private String description;

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public FieldMessage() {
    }

    public FieldMessage(String fieldName, String message) {
        super();
        this.fieldName = fieldName;
        this.message = message;
    }

    public FieldMessage(String fieldName, String message, String description) {
        this.fieldName = fieldName;
        this.message = message;
        this.description = description;
    }

}
