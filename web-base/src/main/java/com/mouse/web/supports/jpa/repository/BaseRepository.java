package com.mouse.web.supports.jpa.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import javax.persistence.EntityManager;
import java.io.Serializable;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/15.
 */
@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

    Page<T> findAllDistinct(Map<String, Object> params, Pageable pageable);

    Page<T> findAll(final Map<String, Object> params, final Pageable pageable);


    EntityManager getEntityManager();

    void clear();

    void close();

    void detach(Object obj);

    void refresh(Object obj);
}
