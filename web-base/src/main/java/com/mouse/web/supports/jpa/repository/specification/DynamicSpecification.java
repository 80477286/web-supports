package com.mouse.web.supports.jpa.repository.specification;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.hibernate.jpa.criteria.path.PluralAttributePath;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class DynamicSpecification<T> implements Specification<T> {
    private Pageable pageable;
    private Map<String, Object> params;
    private boolean distinct = false;

    public DynamicSpecification(Map<String, Object> params, Pageable pageable) {
        this.params = params;
        this.pageable = pageable;
    }

    public DynamicSpecification(Map<String, Object> params, Pageable pageable, boolean distinct) {
        this.params = params;
        this.pageable = pageable;
        this.distinct = distinct;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (pageable != null) {
            if (pageable.getSort() != null) {
                query.orderBy(QueryUtils.toOrders(pageable.getSort(), root, criteriaBuilder));
            }
        }
        query.distinct(this.distinct);
        Predicate resultPre = null;
        if (params != null) {
            Set<Map.Entry<String, Object>> entries = params.entrySet();
            for (Map.Entry<String, Object> entry : entries) {
                Condition specificationOperator = new Condition(entry);
                Predicate predicate = generatePredicate(root, criteriaBuilder, specificationOperator);
                if (predicate != null) {
                    if (resultPre != null) {
                        if (specificationOperator.getOper().equals("or")) {
                            resultPre = criteriaBuilder.or(resultPre, predicate);
                        } else {
                            resultPre = criteriaBuilder.and(resultPre, predicate);
                        }
                    } else {
                        resultPre = predicate;
                    }
                }
            }
        }
        return resultPre;
    }

    /**
     * 根据属性路径生找到整路径
     *
     * @param root
     * @param path
     * @param propertyPath
     * @param <X>
     * @return
     */
    private <X> Path<X> getPath(Root<T> root, Path<?> path, String propertyPath) {
        if (path == null || StringUtils.isEmpty(propertyPath)) {
            return (Path<X>) path;
        }
        String property = StringUtils.substringBefore(propertyPath, ".");
        Path next = null;
        if (PluralAttributePath.class.isAssignableFrom(path.getClass())) {
            PluralAttributePath pap = (PluralAttributePath) path;
            Join join = root.join(pap.getAttribute().getName(), JoinType.LEFT);
            next = join.get(property);
        } else {
            next = path.get(property);
        }
        return getPath(root, next, StringUtils.substringAfter(propertyPath, "."));
    }


    private Predicate generatePredicate(Root<T> root, CriteriaBuilder criteriaBuilder, Condition c) {
        criteriaBuilder.disjunction();
        if (c != null && StringUtils.isNotEmpty(c.getOper())) {
            Path path = getPath(root, root, c.getPath());
            if (("eq".equalsIgnoreCase(c.getOper()) || "=".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                return criteriaBuilder.equal(path, c.getValue());
            } else if (("ge".equalsIgnoreCase(c.getOper()) || ">=".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                return criteriaBuilder.ge(path.as(Number.class), NumberUtils.createNumber(c.getValue().toString()));
            } else if (("le".equalsIgnoreCase(c.getOper()) || "<=".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                return criteriaBuilder.le(path.as(Number.class), NumberUtils.createNumber(c.getValue().toString()));
            } else if (("gt".equalsIgnoreCase(c.getOper()) || ">".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                return criteriaBuilder.gt(path.as(Number.class), NumberUtils.createNumber(c.getValue().toString()));
            } else if (("lt".equalsIgnoreCase(c.getOper()) || "<".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                return criteriaBuilder.lt(path.as(Number.class), NumberUtils.createNumber(c.getValue().toString()));
            } else if (("like".equalsIgnoreCase(c.getOper()) || "l".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                if (c.getValue().getClass().isArray()) {
                    String[] values = (String[]) c.getValue();
                    List<Predicate> predicates = new ArrayList<Predicate>(0);
                    for (int i = 0; i < values.length; i++) {
                        String value = values[i];
                        Condition specificationOperator = new Condition(c.getPath(), value, c.getOper(), c.getJoin());
                        Predicate predicate = generatePredicate(root, criteriaBuilder, specificationOperator);
                        predicates.add(predicate);
                    }
                    return criteriaBuilder.or(predicates.toArray(new Predicate[predicates.size()]));
                } else {
                    return criteriaBuilder.like(path.as(String.class), c.getValue().toString());
                }
            } else if (":".equalsIgnoreCase(c.getOper()) && c.getValue() != null) {
                return criteriaBuilder.like(path.as(String.class), "%" + c.getValue() + "%");
            } else if (":l".equalsIgnoreCase(c.getOper()) && c.getValue() != null) {
                return criteriaBuilder.like(path.as(String.class), "%" + c.getValue());
            } else if ("l:".equalsIgnoreCase(c.getOper()) && c.getValue() != null) {
                return criteriaBuilder.like(path.as(String.class), c.getValue() + "%");
            } else if ("isnull".equalsIgnoreCase(c.getOper()) | "null".equalsIgnoreCase(c.getOper())) {
                return criteriaBuilder.isNull(path);
            } else if ("isnotnull".equalsIgnoreCase(c.getOper()) || "!null".equalsIgnoreCase(c.getOper())) {
                return criteriaBuilder.isNotNull(path);
            } else if (("ne".equalsIgnoreCase(c.getOper()) || "!=".equalsIgnoreCase(c.getOper())) && c.getValue() != null) {
                return criteriaBuilder.notEqual(path, c.getValue());
            }
        }
        return null;
    }
}