//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.mouse.web.supports.autoconfigure;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.boot.validation.MessageInterpolatorFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.validation.Errors;
import org.springframework.validation.SmartValidator;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.OptionalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.SpringValidatorAdapter;

public class WebMvcValidator implements SmartValidator, ApplicationContextAware, InitializingBean, DisposableBean {
    private final SpringValidatorAdapter target;
    private final boolean existingBean;

    WebMvcValidator(SpringValidatorAdapter target, boolean existingBean) {
        this.target = target;
        this.existingBean = existingBean;
    }

    SpringValidatorAdapter getTarget() {
        return this.target;
    }

    public boolean supports(Class<?> clazz) {
        return this.target.supports(clazz);
    }

    public void validate(Object target, Errors errors) {
        this.target.validate(target, errors);
    }

    public void validate(Object target, Errors errors, Object... validationHints) {
        this.target.validate(target, errors, validationHints);
    }

    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        if (!this.existingBean && this.target instanceof ApplicationContextAware) {
            ((ApplicationContextAware) this.target).setApplicationContext(applicationContext);
        }

    }

    public void afterPropertiesSet() throws Exception {
        if (!this.existingBean && this.target instanceof InitializingBean) {
            ((InitializingBean) this.target).afterPropertiesSet();
        }

    }

    public void destroy() throws Exception {
        if (!this.existingBean && this.target instanceof DisposableBean) {
            ((DisposableBean) this.target).destroy();
        }

    }

    public static Validator get(ApplicationContext applicationContext, Validator validator) {
        return validator != null ? wrap(validator, false) : getExistingOrCreate(applicationContext);
    }

    private static Validator getExistingOrCreate(ApplicationContext applicationContext) {
        Validator existing = getExisting(applicationContext);
        return existing != null ? wrap(existing, true) : create();
    }

    private static Validator getExisting(ApplicationContext applicationContext) {
        try {
            javax.validation.Validator validator = (javax.validation.Validator) applicationContext.getBean(javax.validation.Validator.class);
            return (Validator) (validator instanceof Validator ? (Validator) validator : new SpringValidatorAdapter(validator));
        } catch (NoSuchBeanDefinitionException var2) {
            return null;
        }
    }

    private static Validator create() {
        OptionalValidatorFactoryBean validator = new OptionalValidatorFactoryBean();
        validator.setMessageInterpolator((new MessageInterpolatorFactory()).getObject());
        return wrap(validator, false);
    }

    private static Validator wrap(Validator validator, boolean existingBean) {
        return (Validator) (validator instanceof javax.validation.Validator ? (validator instanceof SpringValidatorAdapter ? new WebMvcValidator((SpringValidatorAdapter) validator, existingBean) : new WebMvcValidator(new SpringValidatorAdapter((javax.validation.Validator) validator), existingBean)) : validator);
    }
}
