package com.mouse.web.supports.jpa.controller;

import com.mouse.web.supports.jpa.service.IBaseService;
import com.mouse.web.supports.mvc.bind.annotation.EntityParam;
import com.mouse.web.supports.mvc.bind.annotation.JSON;
import com.mouse.web.supports.mvc.bind.annotation.MapParam;
import com.mouse.web.supports.mvc.request.PageParam;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.Serializable;
import java.security.Principal;
import java.util.List;
import java.util.Map;

public class BaseController<T, ID extends Serializable> {

    protected IBaseService<T, ID> getService() {
        return null;
    }

    @JSON()
    @RequestMapping(value = "/save")
    public T save(@EntityParam T user) {
        T result = getService().save(user);
        return result;
    }

    @JSON()
    @RequestMapping(value = "/get_by_id")
    public T getById(ID id) {
        T result = getService().findOne(id);
        return result;
    }


    @JSON()
    @RequestMapping(value = "/deletes")
    public boolean delete(ID[] ids) {
        getService().delete(ids);
        return true;
    }

    @JSON()
    @RequestMapping(value = "/delete")
    public boolean delete(ID id) {
        getService().delete(id);
        return true;
    }

    @JSON()
    @RequestMapping(value = "/all")
    public List<T> all() {
        return getService().query();
    }

    @JSON()
    @RequestMapping(value = "/query")
    public Page<T> query(@MapParam Map<String, Object> params, @EntityParam PageParam pageable) {
        return getService().query(params, pageable);
    }
}
