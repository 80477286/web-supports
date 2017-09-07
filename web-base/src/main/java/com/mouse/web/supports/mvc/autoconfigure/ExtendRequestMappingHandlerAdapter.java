package com.mouse.web.supports.mvc.autoconfigure;

import com.mouse.web.supports.mvc.argumentsresolver.EntityParamListMethodArgumentResolver;
import com.mouse.web.supports.mvc.argumentsresolver.EntityParamMethodArgumentResolver;
import com.mouse.web.supports.mvc.argumentsresolver.MapParamMethodArgumentResolver;
import com.mouse.web.supports.mvc.returnhandler.JsonHandlerMethodReturnValueHandler;
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
public class ExtendRequestMappingHandlerAdapter extends RequestMappingHandlerAdapter {
    private List<HandlerMethodArgumentResolver> beforeCustomArgumentResolvers;
    private List<HandlerMethodArgumentResolver> afterCustomArgumentResolvers;
    protected List<HandlerMethodReturnValueHandler> beforeCustomReturnHandlers;
    protected List<HandlerMethodReturnValueHandler> afterCustomReturnHandlers;

    public ExtendRequestMappingHandlerAdapter() {
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

        resolvers.add(0, new JsonHandlerMethodReturnValueHandler());
    }

    private void modifyArgumentResolvers() {
        Field field = ReflectionUtils.findField(this.getClass(), "argumentResolvers");
        ReflectionUtils.makeAccessible(field);
        HandlerMethodArgumentResolverComposite rc = (HandlerMethodArgumentResolverComposite) ReflectionUtils.getField(field, this);
        field = ReflectionUtils.findField(rc.getClass(), "argumentResolvers");
        ReflectionUtils.makeAccessible(field);
        List<HandlerMethodArgumentResolver> resolvers = (List<HandlerMethodArgumentResolver>) ReflectionUtils.getField(field, rc);

        resolvers.add(0, new EntityParamListMethodArgumentResolver());
        resolvers.add(0, new EntityParamMethodArgumentResolver());
        resolvers.add(0, new MapParamMethodArgumentResolver());
    }
}
