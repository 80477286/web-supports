package com.mouse.web.supports.mvc.result;

import org.springframework.data.domain.PageImpl;

public class PageResult extends Result {
    private PageImpl page;
    private boolean success = true;

    public PageResult(PageImpl data) {
        super(data);
        this.page = data;
    }

    public long getTotal() {
        return page.getTotalElements();
    }

    public Object getData() {
        return page.getContent();
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }
}