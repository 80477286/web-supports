package com.mouse.web.supports.mvc.result;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class Result {

    private boolean success = false;
    private Object data;
    private String message;
    private final List<String> errors = new ArrayList<String>(0);
    private final List<String> infos = new ArrayList<String>(0);
    private Exception exception = null;

    public Result(boolean success) {
        this.success = success;
    }

    public Result(boolean success, Object data) {
        this.success = success;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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

    public List<String> getInfos() {
        return infos;
    }

    public void addInfo(String info) {
        this.infos.add(info);
    }

    public void addInfos(List<String> infos) {
        this.infos.addAll(infos);
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