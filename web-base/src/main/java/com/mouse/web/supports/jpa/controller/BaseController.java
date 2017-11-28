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

public class BaseController<T, ID extends Serializable> extends BaseReadController<T, ID> {

    protected IBaseService<T, ID> getService() {
        return null;
    }

    @JSON()
    @RequestMapping(value = "/save")
    public T save(@EntityParam T entity) {
        T result = getService().save(entity);
        return result;
    }


    @JSON()
    @RequestMapping(value = "/deletes")
    public boolean deletes(ID[] ids) {
        getService().delete(ids);
        return true;
    }

    @JSON()
    @RequestMapping(value = "/delete")
    public boolean delete(ID id) {
        getService().delete(id);
        return true;
    }

}
