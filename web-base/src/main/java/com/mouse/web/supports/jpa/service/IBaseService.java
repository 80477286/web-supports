package com.mouse.web.supports.jpa.service;

import com.mouse.web.supports.jpa.repository.BaseRepository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface IBaseService<T, ID extends Serializable> {
    BaseRepository<T, ID> getRepository();


    <S extends T> S save(S entity);

    <S extends T> S saveAndFlush(S entity);

    <S extends T> List<S> save(Iterable<S> entities);

    void delete(ID id);

    void delete(ID[] ids);

    void delete(T entity);

    void delete(Iterable<? extends T> entity);

    void deleteAll();

    void deleteInBatch(Iterable<T> entities);

    void deleteAllInBatch();

    T getOne(ID id);

    T findOne(ID id);

    <S extends T> S findOne(Example<S> example);

    List<T> all();

    List<T> query();

    List<T> query(Iterable<ID> ids);

    Iterable<T> query(Sort sort);

    Page<T> query(Pageable pageable);

    Page<T> query(final Map<String, Object> params, final Pageable pageable);

    Page<T> queryDistinct(final Map<String, Object> params, final Pageable pageable);

    <S extends T> Iterable<S> query(Example<S> example);

    <S extends T> Iterable<S> query(Example<S> example, Sort sort);

    <S extends T> Page<S> query(Example<S> example, Pageable pageable);

    boolean exists(ID id);

    <S extends T> boolean exists(Example<S> example);

    long count();

    <S extends T> long count(Example<S> example);

    void flush();

}

