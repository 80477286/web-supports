package com.mouse.web.supports.jpa.service;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public abstract class BaseService<T, ID extends Serializable> implements IBaseService<T, ID> {


    @Override
    public <S extends T> S save(S entity) {
        return getRepository().save(entity);
    }

    @Override
    public <S extends T> S saveAndFlush(S entity) {
        return getRepository().saveAndFlush(entity);
    }


    @Override
    public <S extends T> List<S> save(Iterable<S> entities) {
        return getRepository().save(entities);
    }


    @Override
    public void delete(ID id) {
        getRepository().delete(id);
    }

    @Override
    public void delete(ID[] ids) {
        if (ids != null) {
            for (ID id : ids) {
                getRepository().delete(id);
            }
        }
    }

    @Override
    public void delete(T entity) {
        getRepository().delete(entity);
    }

    @Override
    public void delete(Iterable<? extends T> entity) {
        getRepository().delete(entity);
    }

    @Override
    public void deleteAll() {
        getRepository().deleteAll();
    }

    @Override
    public void deleteInBatch(Iterable<T> entities) {
        getRepository().deleteInBatch(entities);
    }

    @Override
    public void deleteAllInBatch() {
        getRepository().deleteAllInBatch();
    }


    @Override
    public T getOne(ID id) {
        return getRepository().getOne(id);
    }

    @Override
    public T findOne(ID id) {
        return getRepository().findOne(id);
    }


    @Override
    public <S extends T> S findOne(Example<S> example) {
        return getRepository().findOne(example);
    }


    public List<T> query() {
        return getRepository().findAll();
    }

    public List<T> all() {
        return getRepository().findAll();
    }

    @Override
    public List<T> query(Iterable<ID> ids) {
        return getRepository().findAll(ids);
    }

    @Override
    public Iterable<T> query(Sort sort) {
        return getRepository().findAll(sort);
    }

    @Override
    public Page<T> query(Pageable pageable) {
        return getRepository().findAll(pageable);
    }

    @Override
    public Page<T> query(Map<String, Object> params, Pageable pageable) {
        return getRepository().findAll(params, pageable);
    }

    @Override
    public Page<T> queryDistinct(Map<String, Object> params, Pageable pageable) {
        return getRepository().findAllDistinct(params, pageable);
    }

    @Override
    public <S extends T> Iterable<S> query(Example<S> example) {
        return getRepository().findAll(example);
    }

    @Override
    public <S extends T> Iterable<S> query(Example<S> example, Sort sort) {
        return getRepository().findAll(example, sort);
    }


    @Override
    public <S extends T> Page<S> query(Example<S> example, Pageable pageable) {
        return getRepository().findAll(example, pageable);
    }


    @Override
    public boolean exists(ID id) {
        return getRepository().exists(id);
    }

    @Override
    public <S extends T> boolean exists(Example<S> example) {
        return getRepository().exists(example);
    }


    @Override
    public long count() {
        return getRepository().count();
    }

    @Override
    public <S extends T> long count(Example<S> example) {
        return getRepository().count(example);
    }


    @Override
    public void flush() {
        getRepository().flush();
    }


}
