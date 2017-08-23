package com.mouse.web.supports.mvc.request;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class PageParam extends PageRequest {
    public PageParam() {
        super(0, Integer.MAX_VALUE);
    }

    public PageParam(int page, int size) {
        super(page, size);
    }

    public PageParam(int page, int size, Sort.Direction direction, String... properties) {
        super(page, size, direction, properties);
    }

    public PageParam(int page, int size, Sort sort) {
        super(page, size, sort);
    }


    public void setPage(int page) {
        Field field = ReflectionUtils.findField(this.getClass(), "page");
        ReflectionUtils.makeAccessible(field);
        ReflectionUtils.setField(field, this, page);
    }

    public void setSize(int size) {
        Field field = ReflectionUtils.findField(this.getClass(), "size");
        ReflectionUtils.makeAccessible(field);
        ReflectionUtils.setField(field, this, size);
    }
}
