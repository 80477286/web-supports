package com.mouse.web.supports.mvc.autoconfigure;

import org.springframework.util.ReflectionUtils;
import org.springframework.web.method.annotation.ModelAttributeMethodProcessor;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolverComposite;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.HandlerMethodReturnValueHandlerComposite;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import java.lang.reflect.Field;
import java.sql.Ref;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by cwx183898 on 2017/8/17.
 */
public class EntityParamRequestMappingHandlerAdapter extends RequestMappingHandlerAdapter {
    private List<HandlerMethodArgumentResolver> beforeCustomArgumentResolvers;
    private List<HandlerMethodArgumentResolver> afterCustomArgumentResolvers;
    protected List<HandlerMethodReturnValueHandler> beforeCustomReturnHandlers;
    protected List<HandlerMethodReturnValueHandler> afterCustomReturnHandlers;

    public EntityParamRequestMappingHandlerAdapter(List<HandlerMethodArgumentResolver> beforeCustomArgumentResolvers, List<HandlerMethodArgumentResolver> afterCustomArgumentResolvers, List<HandlerMethodReturnValueHandler> beforeCustomReturnHandlers, List<HandlerMethodReturnValueHandler> afterCustomReturnHandlers) {
        this.beforeCustomArgumentResolvers = beforeCustomArgumentResolvers;
        this.afterCustomArgumentResolvers = afterCustomArgumentResolvers;
        this.beforeCustomReturnHandlers = beforeCustomReturnHandlers;
        this.afterCustomReturnHandlers = afterCustomReturnHandlers;
    }

    @Override
    public void afterPropertiesSet() {
        super.afterPropertiesSet();

        modifyArgumentResolvers();
        modifyReturnHandlers();


    }

    private void modifyReturnHandlers() {
        Field field = ReflectionUtils.findField(this.getClass(), "returnValueHandlers");
        ReflectionUtils.makeAccessible(field);
        HandlerMethodReturnValueHandlerComposite rc = (HandlerMethodReturnValueHandlerComposite) ReflectionUtils.getField(field, this);
        field = ReflectionUtils.findField(rc.getClass(), "returnValueHandlers");
        ReflectionUtils.makeAccessible(field);
        List<HandlerMethodReturnValueHandler> resolvers = (List<HandlerMethodReturnValueHandler>) ReflectionUtils.getField(field, rc);
        if (beforeCustomReturnHandlers != null) {
            for (int i = beforeCustomReturnHandlers.size() - 1; i >= 0; i--) {
                HandlerMethodReturnValueHandler handler = beforeCustomReturnHandlers.get(i);
                resolvers.add(0, handler);
            }
        }
        if (afterCustomReturnHandlers != null) {
            for (HandlerMethodReturnValueHandler handler : afterCustomReturnHandlers) {
                resolvers.add(handler);
            }
        }
    }

    private void modifyArgumentResolvers() {
        Field field = ReflectionUtils.findField(this.getClass(), "argumentResolvers");
        ReflectionUtils.makeAccessible(field);
        HandlerMethodArgumentResolverComposite rc = (HandlerMethodArgumentResolverComposite) ReflectionUtils.getField(field, this);
        field = ReflectionUtils.findField(rc.getClass(), "argumentResolvers");
        ReflectionUtils.makeAccessible(field);
        List<HandlerMethodArgumentResolver> resolvers = (List<HandlerMethodArgumentResolver>) ReflectionUtils.getField(field, rc);
        if (beforeCustomArgumentResolvers != null) {
            for (int i = beforeCustomArgumentResolvers.size() - 1; i >= 0; i--) {
                HandlerMethodArgumentResolver resolver = beforeCustomArgumentResolvers.get(i);
                resolvers.add(0, resolver);
            }
        }
        if (afterCustomArgumentResolvers != null) {
            for (HandlerMethodArgumentResolver resolver : afterCustomArgumentResolvers) {
                resolvers.add(resolver);
            }
        }
    }
}
