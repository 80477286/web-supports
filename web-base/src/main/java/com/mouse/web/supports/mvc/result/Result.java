package com.mouse.web.supports.mvc.result;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class Result {

    private boolean success = false;
    private Object data;
    private String result;
    private final List<String> errors = new ArrayList<String>(0);
    private final List<String> messages = new ArrayList<String>(0);
    private Exception exception = null;

    public Result(boolean success) {
        this.success = success;
    }

    public Result(boolean success, Object data) {
        this.success = success;
        this.data = data;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Result(Object data) {
        this.data = data;
    }

    public Object getData() {
        return data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void addError(String error) {
        this.errors.add(error);
    }

    public void addErrors(List<String> errors) {
        this.errors.addAll(errors);
    }

    public List<String> getMessages() {
        return messages;
    }

    public void addMessage(String message) {
        this.messages.add(message);
    }

    public void addMessages(List<String> messages) {
        this.messages.addAll(messages);
    }

    public String getException() {
        if (this.exception == null) {
            return null;
        }
        try {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            this.exception.printStackTrace(pw);
            return sw.toString();
        } catch (Exception e2) {
            return "bad getErrorInfoFromException";
        }
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }
}