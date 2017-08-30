package com.mouse.web.supports.mvc.bind.annotation;

import java.lang.annotation.*;

/**
 * Created by cwx183898 on 2017/8/17.
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface JSON {
    public String[] excludeProperties() default {};

    public String[] includeProperties() default {};

    public boolean ignoreHierarchy() default false;

    public boolean enumAsBean() default false;

    public boolean excludeNullProperties() default false;

}
