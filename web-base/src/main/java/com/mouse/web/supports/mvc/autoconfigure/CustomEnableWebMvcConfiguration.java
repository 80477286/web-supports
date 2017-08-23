package com.mouse.web.supports.mvc.autoconfigure;

import com.mouse.web.supports.mvc.argumentsresolver.EntityParamListMethodArgumentResolver;
import com.mouse.web.supports.mvc.argumentsresolver.EntityParamMethodArgumentResolver;
import com.mouse.web.supports.mvc.argumentsresolver.MapParamMethodArgumentResolver;
import com.mouse.web.supports.mvc.converter.JsonResultHttpMessageConverter;
import com.mouse.web.supports.mvc.returnhandler.JsonResultReturnHandler;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration;
import org.springframework.boot.autoconfigure.web.WebMvcProperties;
import org.springframework.boot.autoconfigure.web.WebMvcRegistrations;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by cwx183898 on 2017/8/16.
 */
@Configuration
public class CustomEnableWebMvcConfiguration extends WebMvcAutoConfiguration.EnableWebMvcConfiguration {
    private final WebMvcProperties mvcProperties;

    private final ListableBeanFactory beanFactory;

    private final WebMvcRegistrations mvcRegistrations;

    private String requestMappingHandlerAdapter;
    protected List<HandlerMethodArgumentResolver> beforeCustomArgumentResolvers;
    protected List<HandlerMethodArgumentResolver> afterCustomArgumentResolvers;

    protected List<HandlerMethodReturnValueHandler> beforeCustomReturnHandlers;
    protected List<HandlerMethodReturnValueHandler> afterCustomReturnHandlers;


    public CustomEnableWebMvcConfiguration(ObjectProvider<WebMvcProperties> mvcPropertiesProvider, ObjectProvider<WebMvcRegistrations> mvcRegistrationsProvider, ListableBeanFactory beanFactory) {
        super(mvcPropertiesProvider, mvcRegistrationsProvider, beanFactory);
        this.mvcProperties = mvcPropertiesProvider.getIfAvailable();
        this.mvcRegistrations = mvcRegistrationsProvider.getIfUnique();
        this.beanFactory = beanFactory;
    }

    @Override
    protected RequestMappingHandlerAdapter createRequestMappingHandlerAdapter() {
        if (this.mvcRegistrations != null
                && this.mvcRegistrations.getRequestMappingHandlerAdapter() != null) {
            return this.mvcRegistrations.getRequestMappingHandlerAdapter();
        }
        initBeforeCustomArgumentResolvers(null);
        initAfterCustomArgumentResolvers(null);
        initBeforeCustomReturnHandlers(null);
        initAfterCustomReturnHandlers(null);
        return new EntityParamRequestMappingHandlerAdapter(beforeCustomArgumentResolvers, afterCustomArgumentResolvers, beforeCustomReturnHandlers, afterCustomReturnHandlers);

    }

    public void initAfterCustomArgumentResolvers(List<HandlerMethodArgumentResolver> afterCustomArgumentResolvers) {
        if (this.afterCustomArgumentResolvers == null) {
            this.afterCustomArgumentResolvers = new ArrayList<HandlerMethodArgumentResolver>(0);
        }
        if (afterCustomArgumentResolvers != null) {
            this.afterCustomArgumentResolvers.addAll(afterCustomArgumentResolvers);
        }
    }

    public void initBeforeCustomArgumentResolvers(List<HandlerMethodArgumentResolver> beforeCustomArgumentResolvers) {
        if (this.beforeCustomArgumentResolvers == null) {
            this.beforeCustomArgumentResolvers = new ArrayList<HandlerMethodArgumentResolver>(0);
        }
        this.beforeCustomArgumentResolvers.add(new EntityParamListMethodArgumentResolver());
        this.beforeCustomArgumentResolvers.add(new EntityParamMethodArgumentResolver());
        this.beforeCustomArgumentResolvers.add(new MapParamMethodArgumentResolver());

        if (beforeCustomArgumentResolvers != null) {
            this.beforeCustomArgumentResolvers.addAll(beforeCustomArgumentResolvers);
        }
    }


    public void initAfterCustomReturnHandlers(List<HandlerMethodReturnValueHandler> afterCustomReturnHandlers) {
        if (this.afterCustomReturnHandlers == null) {
            this.afterCustomReturnHandlers = new ArrayList<HandlerMethodReturnValueHandler>(0);
        }
        if (afterCustomReturnHandlers != null) {
            this.afterCustomReturnHandlers.addAll(afterCustomReturnHandlers);
        }
    }

    public void initBeforeCustomReturnHandlers(List<HandlerMethodReturnValueHandler> beforeCustomReturnHandlers) {
        if (this.beforeCustomReturnHandlers == null) {
            this.beforeCustomReturnHandlers = new ArrayList<HandlerMethodReturnValueHandler>(0);
        }

        List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>(0);
        converters.add(new JsonResultHttpMessageConverter());
        this.beforeCustomReturnHandlers.add(new JsonResultReturnHandler(converters));

        if (beforeCustomReturnHandlers != null) {
            this.beforeCustomReturnHandlers.addAll(beforeCustomReturnHandlers);
        }
    }
}
