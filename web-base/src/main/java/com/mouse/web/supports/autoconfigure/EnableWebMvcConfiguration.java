package com.mouse.web.supports.autoconfigure;

import com.mouse.web.supports.mvc.autoconfigure.ExtendRequestMappingHandlerAdapter;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.web.WebMvcProperties;
import org.springframework.boot.autoconfigure.web.WebMvcRegistrations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ClassUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.support.ConfigurableWebBindingInitializer;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration;
import org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

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
        if (this.mvcRegistrations != null && this.mvcRegistrations.getRequestMappingHandlerAdapter() != null) {
            return this.mvcRegistrations.getRequestMappingHandlerAdapter();
        } else {
            return new ExtendRequestMappingHandlerAdapter();
        }
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

}
