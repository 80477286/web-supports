package com.mouse.web.supports.jpa.repository;

import com.mouse.web.supports.jpa.repository.specification.DynamicSpecification;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.io.Serializable;
import java.util.Map;
import java.util.Set;

/**
 * Created by cwx183898 on 2017/8/15.
 */
@NoRepositoryBean
public class BaseRepositoryImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> implements BaseRepository<T, ID> {
    public BaseRepositoryImpl(Class<T> domainClass, EntityManager em) {
        super(domainClass, em);
    }

    public BaseRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
    }

    @Override
    public Page<T> findAll(final Map<String, Object> params, Pageable pageable) {
        if (pageable == null) {
            pageable = new PageRequest(0, Integer.MAX_VALUE);
        }
        Specification spec = new DynamicSpecification(params, pageable);
        TypedQuery<T> query = getQuery(spec, pageable);
        Page<T> page = readPage(query, getDomainClass(), pageable, spec);
        return page;
    }
}
