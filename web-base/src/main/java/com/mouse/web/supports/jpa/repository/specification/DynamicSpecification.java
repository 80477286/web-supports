package com.mouse.web.supports.jpa.repository.specification;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;

import javax.persistence.criteria.*;
import java.util.Map;
import java.util.Set;

import static org.springframework.data.jpa.repository.query.QueryUtils.toOrders;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class DynamicSpecification<T> implements Specification<T> {
    private Pageable pageable;
    private Map<String, Object> params;

    public DynamicSpecification(Map<String, Object> params, Pageable pageable) {
        this.params = params;
        this.pageable = pageable;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        if (pageable != null) {
            if (pageable.getSort() != null) {
                query.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));
            }
        }

        Predicate predicate = null;
        if (params != null) {
            Set<Map.Entry<String, Object>> entries = params.entrySet();
            for (Map.Entry<String, Object> entry : entries) {
                String key = entry.getKey();
                int index = key.indexOf('_');
                String fieldName = key;
                if (index > 0) {
                    fieldName = key.substring(0, index);
                }
                Path<T> path = getPath(root, fieldName);
                predicate = cb.equal(path, entry.getValue());
            }
        }
        return predicate;
    }

    private <X> Path<X> getPath(Path<?> path, String propertyPath) {
        if (path == null || StringUtils.isEmpty(propertyPath)) {
            return (Path<X>) path;
        }
        String property = StringUtils.substringBefore(propertyPath, ".");
        return getPath(path.get(property), StringUtils.substringAfter(propertyPath, "."));
    }
}
