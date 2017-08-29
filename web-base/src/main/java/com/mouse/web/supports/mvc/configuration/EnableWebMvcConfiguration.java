package com.mouse.web.supports.mvc.configuration;

import com.mouse.web.supports.mvc.argumentsresolver.EntityParamListMethodArgumentResolver;
import com.mouse.web.supports.mvc.argumentsresolver.EntityParamMethodArgumentResolver;
import com.mouse.web.supports.mvc.argumentsresolver.MapParamMethodArgumentResolver;
import com.mouse.web.supports.mvc.autoconfigure.ExtendRequestMappingHandlerAdapter;
import com.mouse.web.supports.mvc.converter.JsonResultHttpMessageConverter;
import com.mouse.web.supports.mvc.returnhandler.JsonResultReturnHandler;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.web.WebMvcProperties;
import org.springframework.boot.autoconfigure.web.WebMvcRegistrations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.ClassUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.support.ConfigurableWebBindingInitializer;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by user on 2017/8/23.
 */
@Configuration
public class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration {
    private final WebMvcProperties mvcProperties;
    private final ListableBeanFactory beanFactory;
    private final WebMvcRegistrations mvcRegistrations;
    protected List<HandlerMethodArgumentResolver> beforeCustomArgumentResolvers;
    protected List<HandlerMethodArgumentResolver> afterCustomArgumentResolvers;

    protected List<HandlerMethodReturnValueHandler> beforeCustomReturnHandlers;
    protected List<HandlerMethodReturnValueHandler> afterCustomReturnHandlers;


    public EnableWebMvcConfiguration(ObjectProvider<WebMvcProperties> mvcPropertiesProvider, ObjectProvider<WebMvcRegistrations> mvcRegistrationsProvider, ListableBeanFactory beanFactory) {
        this.mvcProperties = (WebMvcProperties) mvcPropertiesProvider.getIfAvailable();
        this.mvcRegistrations = (WebMvcRegistrations) mvcRegistrationsProvider.getIfUnique();
        this.beanFactory = beanFactory;
    }

    @Bean
    public RequestMappingHandlerAdapter requestMappingHandlerAdapter() {
        RequestMappingHandlerAdapter adapter = super.requestMappingHandlerAdapter();
        adapter.setIgnoreDefaultModelOnRedirect(this.mvcProperties == null ? true : this.mvcProperties.isIgnoreDefaultModelOnRedirect());
        return adapter;
    }

    protected RequestMappingHandlerAdapter createRequestMappingHandlerAdapter() {
        initBeforeCustomArgumentResolvers(null);
        initAfterCustomArgumentResolvers(null);
        initBeforeCustomReturnHandlers(null);
        initAfterCustomReturnHandlers(null);
        if (this.mvcRegistrations != null && this.mvcRegistrations.getRequestMappingHandlerAdapter() != null) {
            return this.mvcRegistrations.getRequestMappingHandlerAdapter();
        } else {
            return new ExtendRequestMappingHandlerAdapter(beforeCustomArgumentResolvers, afterCustomArgumentResolvers, beforeCustomReturnHandlers, afterCustomReturnHandlers);
        }
    }

    @Bean
    @Primary
    public RequestMappingHandlerMapping requestMappingHandlerMapping() {
        return super.requestMappingHandlerMapping();
    }

    @Bean
    public Validator mvcValidator() {
        return !ClassUtils.isPresent("javax.validation.Validator", this.getClass().getClassLoader()) ? super.mvcValidator() : WebMvcValidator.get(this.getApplicationContext(), this.getValidator());
    }

    protected RequestMappingHandlerMapping createRequestMappingHandlerMapping() {
        return this.mvcRegistrations != null && this.mvcRegistrations.getRequestMappingHandlerMapping() != null ? this.mvcRegistrations.getRequestMappingHandlerMapping() : super.createRequestMappingHandlerMapping();
    }

    protected ConfigurableWebBindingInitializer getConfigurableWebBindingInitializer() {
        try {
            return (ConfigurableWebBindingInitializer) this.beanFactory.getBean(ConfigurableWebBindingInitializer.class);
        } catch (NoSuchBeanDefinitionException var2) {
            return super.getConfigurableWebBindingInitializer();
        }
    }

    protected ExceptionHandlerExceptionResolver createExceptionHandlerExceptionResolver() {
        return this.mvcRegistrations != null && this.mvcRegistrations.getExceptionHandlerExceptionResolver() != null ? this.mvcRegistrations.getExceptionHandlerExceptionResolver() : super.createExceptionHandlerExceptionResolver();
    }

    protected void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> exceptionResolvers) {
        super.configureHandlerExceptionResolvers(exceptionResolvers);
        if (exceptionResolvers.isEmpty()) {
            this.addDefaultHandlerExceptionResolvers(exceptionResolvers);
        }

        if (this.mvcProperties.isLogResolvedException()) {
            Iterator var2 = exceptionResolvers.iterator();

            while (var2.hasNext()) {
                HandlerExceptionResolver resolver = (HandlerExceptionResolver) var2.next();
                if (resolver instanceof AbstractHandlerExceptionResolver) {
                    ((AbstractHandlerExceptionResolver) resolver).setWarnLogCategory(resolver.getClass().getName());
                }
            }
        }

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

        this.beforeCustomReturnHandlers.add(new JsonResultReturnHandler());

        if (beforeCustomReturnHandlers != null) {
            this.beforeCustomReturnHandlers.addAll(beforeCustomReturnHandlers);
        }
    }
}
