//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.mouse.web.supports.autoconfigure;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.boot.autoconfigure.condition.*;
import org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration;
import org.springframework.boot.autoconfigure.web.*;
import org.springframework.boot.autoconfigure.web.ResourceProperties.Chain;
import org.springframework.boot.autoconfigure.web.ResourceProperties.Strategy;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.filter.OrderedHiddenHttpMethodFilter;
import org.springframework.boot.web.filter.OrderedHttpPutFormContentFilter;
import org.springframework.boot.web.filter.OrderedRequestContextFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.GenericConverter;
import org.springframework.core.io.Resource;
import org.springframework.format.Formatter;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.DefaultMessageCodesResolver;
import org.springframework.validation.MessageCodesResolver;
import org.springframework.web.accept.ContentNegotiationManager;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.filter.HttpPutFormContentFilter;
import org.springframework.web.filter.RequestContextFilter;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.handler.AbstractUrlHandlerMapping;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import org.springframework.web.servlet.i18n.FixedLocaleResolver;
import org.springframework.web.servlet.mvc.ParameterizableViewController;
import org.springframework.web.servlet.resource.*;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import javax.servlet.Servlet;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.*;
import java.util.Map.Entry;

@Configuration
@ConditionalOnWebApplication
@ConditionalOnClass({Servlet.class, DispatcherServlet.class, WebMvcConfigurerAdapter.class})
@ConditionalOnMissingBean({WebMvcAutoConfiguration.class})
@AutoConfigureOrder(-2147483638)
@AutoConfigureAfter({DispatcherServletAutoConfiguration.class, ValidationAutoConfiguration.class})
public class WebMvcAutoConfiguration {
    public static String DEFAULT_PREFIX = "";
    public static String DEFAULT_SUFFIX = "";

    public WebMvcAutoConfiguration() {
    }

    @Bean
    @ConditionalOnMissingBean({HiddenHttpMethodFilter.class})
    public OrderedHiddenHttpMethodFilter hiddenHttpMethodFilter() {
        return new OrderedHiddenHttpMethodFilter();
    }

    @Bean
    @ConditionalOnMissingBean({HttpPutFormContentFilter.class})
    @ConditionalOnProperty(
            prefix = "spring.mvc.formcontent.putfilter",
            name = {"enabled"},
            matchIfMissing = true
    )
    public OrderedHttpPutFormContentFilter httpPutFormContentFilter() {
        return new OrderedHttpPutFormContentFilter();
    }

    static final class WelcomePageHandlerMapping extends AbstractUrlHandlerMapping {
        private static final Log logger = LogFactory.getLog(WebMvcAutoConfiguration.WelcomePageHandlerMapping.class);

        private WelcomePageHandlerMapping(Resource welcomePage) {
            if (welcomePage != null) {
                logger.info("Adding welcome page: " + welcomePage);
                ParameterizableViewController controller = new ParameterizableViewController();
                controller.setViewName("forward:index.html");
                this.setRootHandler(controller);
                this.setOrder(0);
            }

        }

        public Object getHandlerInternal(HttpServletRequest request) throws Exception {
            Iterator var2 = this.getAcceptedMediaTypes(request).iterator();

            MediaType mediaType;
            do {
                if (!var2.hasNext()) {
                    return null;
                }

                mediaType = (MediaType) var2.next();
            } while (!mediaType.includes(MediaType.TEXT_HTML));

            return super.getHandlerInternal(request);
        }

        private List<MediaType> getAcceptedMediaTypes(HttpServletRequest request) {
            String acceptHeader = request.getHeader("Accept");
            return MediaType.parseMediaTypes(StringUtils.hasText(acceptHeader) ? acceptHeader : "*/*");
        }
    }

    private static class ResourceChainResourceHandlerRegistrationCustomizer implements WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer {
        @Autowired
        private ResourceProperties resourceProperties;

        private ResourceChainResourceHandlerRegistrationCustomizer() {
            this.resourceProperties = new ResourceProperties();
        }

        public void customize(ResourceHandlerRegistration registration) {
            Chain properties = this.resourceProperties.getChain();
            this.configureResourceChain(properties, registration.resourceChain(properties.isCache()));
        }

        private void configureResourceChain(Chain properties, ResourceChainRegistration chain) {
            Strategy strategy = properties.getStrategy();
            if (strategy.getFixed().isEnabled() || strategy.getContent().isEnabled()) {
                chain.addResolver(this.getVersionResourceResolver(strategy));
            }

            if (properties.isGzipped()) {
                chain.addResolver(new GzipResourceResolver());
            }

            if (properties.isHtmlApplicationCache()) {
                chain.addTransformer(new AppCacheManifestTransformer());
            }

        }

        private ResourceResolver getVersionResourceResolver(Strategy properties) {
            VersionResourceResolver resolver = new VersionResourceResolver();
            if (properties.getFixed().isEnabled()) {
                String version = properties.getFixed().getVersion();
                String[] paths = properties.getFixed().getPaths();
                resolver.addFixedVersionStrategy(version, paths);
            }

            if (properties.getContent().isEnabled()) {
                String[] paths = properties.getContent().getPaths();
                resolver.addContentVersionStrategy(paths);
            }

            return resolver;
        }
    }

    interface ResourceHandlerRegistrationCustomizer {
        void customize(ResourceHandlerRegistration var1);
    }

    @Configuration
    @ConditionalOnEnabledResourceChain
    static class ResourceChainCustomizerConfiguration {
        ResourceChainCustomizerConfiguration() {
        }

        @Bean
        public WebMvcAutoConfiguration.ResourceChainResourceHandlerRegistrationCustomizer resourceHandlerRegistrationCustomizer() {
            return new WebMvcAutoConfiguration.ResourceChainResourceHandlerRegistrationCustomizer();
        }
    }


    @Configuration
    @Import({EnableWebMvcConfiguration.class})
    @EnableConfigurationProperties({WebMvcProperties.class, ResourceProperties.class})
    public static class WebMvcAutoConfigurationAdapter extends WebMvcConfigurerAdapter {
        private static final Log logger = LogFactory.getLog(WebMvcConfigurerAdapter.class);
        private final ResourceProperties resourceProperties;
        private final WebMvcProperties mvcProperties;
        private final ListableBeanFactory beanFactory;
        private final HttpMessageConverters messageConverters;
        final WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer resourceHandlerRegistrationCustomizer;

        public WebMvcAutoConfigurationAdapter(ResourceProperties resourceProperties, WebMvcProperties mvcProperties, ListableBeanFactory beanFactory, HttpMessageConverters messageConverters, ObjectProvider<ResourceHandlerRegistrationCustomizer> resourceHandlerRegistrationCustomizerProvider) {
            this.resourceProperties = resourceProperties;
            this.mvcProperties = mvcProperties;
            this.beanFactory = beanFactory;
            this.messageConverters = messageConverters;
            this.resourceHandlerRegistrationCustomizer = (WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer) resourceHandlerRegistrationCustomizerProvider.getIfAvailable();
        }

        public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
            converters.addAll(this.messageConverters.getConverters());
        }

        public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
            Long timeout = this.mvcProperties.getAsync().getRequestTimeout();
            if (timeout != null) {
                configurer.setDefaultTimeout(timeout.longValue());
            }

        }

        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            Map<String, MediaType> mediaTypes = this.mvcProperties.getMediaTypes();
            Iterator var3 = mediaTypes.entrySet().iterator();

            while (var3.hasNext()) {
                Entry<String, MediaType> mediaType = (Entry) var3.next();
                configurer.mediaType((String) mediaType.getKey(), (MediaType) mediaType.getValue());
            }

        }

        @Bean
        @ConditionalOnMissingBean
        public InternalResourceViewResolver defaultViewResolver() {
            InternalResourceViewResolver resolver = new InternalResourceViewResolver();
            resolver.setPrefix(this.mvcProperties.getView().getPrefix());
            resolver.setSuffix(this.mvcProperties.getView().getSuffix());
            return resolver;
        }

        @Bean
        @ConditionalOnBean({View.class})
        @ConditionalOnMissingBean
        public BeanNameViewResolver beanNameViewResolver() {
            BeanNameViewResolver resolver = new BeanNameViewResolver();
            resolver.setOrder(2147483637);
            return resolver;
        }

        @Bean
        @ConditionalOnBean({ViewResolver.class})
        @ConditionalOnMissingBean(
                name = {"viewResolver"},
                value = {ContentNegotiatingViewResolver.class}
        )
        public ContentNegotiatingViewResolver viewResolver(BeanFactory beanFactory) {
            ContentNegotiatingViewResolver resolver = new ContentNegotiatingViewResolver();
            resolver.setContentNegotiationManager((ContentNegotiationManager) beanFactory.getBean(ContentNegotiationManager.class));
            resolver.setOrder(-2147483648);
            return resolver;
        }

        @Bean
        @ConditionalOnMissingBean
        @ConditionalOnProperty(
                prefix = "spring.mvc",
                name = {"locale"}
        )
        public LocaleResolver localeResolver() {
            if (this.mvcProperties.getLocaleResolver() == WebMvcProperties.LocaleResolver.FIXED) {
                return new FixedLocaleResolver(this.mvcProperties.getLocale());
            } else {
                AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
                localeResolver.setDefaultLocale(this.mvcProperties.getLocale());
                return localeResolver;
            }
        }

        @Bean
        @ConditionalOnProperty(
                prefix = "spring.mvc",
                name = {"date-format"}
        )
        public Formatter<Date> dateFormatter() {
            return new DateFormatter(this.mvcProperties.getDateFormat());
        }

        public MessageCodesResolver getMessageCodesResolver() {
            if (this.mvcProperties.getMessageCodesResolverFormat() != null) {
                DefaultMessageCodesResolver resolver = new DefaultMessageCodesResolver();
                resolver.setMessageCodeFormatter(this.mvcProperties.getMessageCodesResolverFormat());
                return resolver;
            } else {
                return null;
            }
        }

        public void addFormatters(FormatterRegistry registry) {
            Iterator var2 = this.getBeansOfType(Converter.class).iterator();

            while (var2.hasNext()) {
                Converter<?, ?> converter = (Converter) var2.next();
                registry.addConverter(converter);
            }

            var2 = this.getBeansOfType(GenericConverter.class).iterator();

            while (var2.hasNext()) {
                GenericConverter converter = (GenericConverter) var2.next();
                registry.addConverter(converter);
            }

            var2 = this.getBeansOfType(Formatter.class).iterator();

            while (var2.hasNext()) {
                Formatter<?> formatter = (Formatter) var2.next();
                registry.addFormatter(formatter);
            }

        }

        private <T> Collection<T> getBeansOfType(Class<T> type) {
            return this.beanFactory.getBeansOfType(type).values();
        }

        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            if (!this.resourceProperties.isAddMappings()) {
                logger.debug("Default resource handling disabled");
            } else {
                Integer cachePeriod = this.resourceProperties.getCachePeriod();
                if (!registry.hasMappingForPattern("/webjars/**")) {
                    this.customizeResourceHandlerRegistration(registry.addResourceHandler(new String[]{"/webjars/**"}).addResourceLocations(new String[]{"classpath:/META-INF/resources/webjars/"}).setCachePeriod(cachePeriod));
                }

                String staticPathPattern = this.mvcProperties.getStaticPathPattern();
                if (!registry.hasMappingForPattern(staticPathPattern)) {
                    this.customizeResourceHandlerRegistration(registry.addResourceHandler(new String[]{staticPathPattern}).addResourceLocations(this.resourceProperties.getStaticLocations()).setCachePeriod(cachePeriod));
                }

            }
        }

        @Bean
        public WebMvcAutoConfiguration.WelcomePageHandlerMapping welcomePageHandlerMapping(ResourceProperties resourceProperties) {
            return new WebMvcAutoConfiguration.WelcomePageHandlerMapping(resourceProperties.getWelcomePage());
        }

        private void customizeResourceHandlerRegistration(ResourceHandlerRegistration registration) {
            if (this.resourceHandlerRegistrationCustomizer != null) {
                this.resourceHandlerRegistrationCustomizer.customize(registration);
            }

        }

        @Bean
        @ConditionalOnMissingBean({RequestContextListener.class, RequestContextFilter.class})
        public static RequestContextFilter requestContextFilter() {
            return new OrderedRequestContextFilter();
        }

        @Configuration
        @ConditionalOnProperty(
                value = {"spring.mvc.favicon.enabled"},
                matchIfMissing = true
        )
        public static class FaviconConfiguration {
            private final ResourceProperties resourceProperties;

            public FaviconConfiguration(ResourceProperties resourceProperties) {
                this.resourceProperties = resourceProperties;
            }

            @Bean
            public SimpleUrlHandlerMapping faviconHandlerMapping() {
                SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
                mapping.setOrder(-2147483647);
                mapping.setUrlMap(Collections.singletonMap("**/favicon.ico", this.faviconRequestHandler()));
                return mapping;
            }

            @Bean
            public ResourceHttpRequestHandler faviconRequestHandler() {
                ResourceHttpRequestHandler requestHandler = new ResourceHttpRequestHandler();
                Method method = ReflectionUtils.findMethod(this.resourceProperties.getClass(), "getFaviconLocations");
                ReflectionUtils.makeAccessible(method);
                List<Resource> locations = (List<Resource>) ReflectionUtils.invokeMethod(method, this.resourceProperties);
                requestHandler.setLocations(locations);
                return requestHandler;
            }
        }
    }
}
