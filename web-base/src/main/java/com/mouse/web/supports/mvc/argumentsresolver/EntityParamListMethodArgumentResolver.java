package com.mouse.web.supports.mvc.argumentsresolver;

import com.mouse.web.supports.mvc.bind.annotation.EntityParam;
import org.springframework.beans.*;
import org.springframework.core.CollectionFactory;
import org.springframework.core.Conventions;
import org.springframework.core.MethodParameter;
import org.springframework.core.ResolvableType;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.annotation.ModelAttributeMethodProcessor;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import sun.reflect.Reflection;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.net.URLDecoder;
import java.util.*;

/**
 * Created by cwx183898 on 2017/8/17.
 */
public class EntityParamListMethodArgumentResolver implements HandlerMethodArgumentResolver {
    private static final String PROPERTY_KEY_SUFFIX = "[";
    private static final String PROPERTY_KEY_PREFIX = "]";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(EntityParam.class) && Collection.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        String parameterName = parameter.getParameterName();

        // 查找是否已有名为name的参数值的映射，如果没有则创建一个
        boolean contains = mavContainer.containsAttribute(parameterName);
        Object attribute = null;
        if (contains) {
            attribute = mavContainer.getModel().get(parameterName);
        } else {
            attribute = createAttribute(parameterName, parameter, binderFactory, webRequest);
        }

        if (binderFactory != null) {
            WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, "list");

            if (binder.getTarget() != null) {
                Class valueClass = ResolvableType.forMethodParameter(parameter).asCollection().resolveGeneric();
                // 进行参数绑定
                this.bindRequestParameters(binder, webRequest, parameterName, valueClass);
            }

            // 将参数转到预期类型，第一个参数为解析后的值，第二个参数为绑定Controller参数的类型，第三个参数为绑定的Controller参数

            Object target = binder.getTarget();
            if (target instanceof Revier) {
                Field field = ReflectionUtils.findField(binder.getClass(), "target");
                ReflectionUtils.makeAccessible(field);
                ReflectionUtils.setField(field, binder, ((Revier) target).getList());
            }
            Class clazz = parameter.getParameterType();
            attribute = binder.convertIfNecessary(binder.getTarget(), clazz, parameter);
        }

        return attribute;
    }

    protected void bindRequestParameters(WebDataBinder binder, NativeWebRequest request, String parameterName, Class valueClass) throws UnsupportedEncodingException {
        // 将key-value封装为map，传给bind方法进行参数值绑定
        Map<String, String> map = new HashMap<String, String>(0);
        Map<String, String[]> params = request.getParameterMap();
        Revier revier = (Revier) binder.getTarget();
        for (Map.Entry<String, String[]> entry : params.entrySet()) {
            String name = entry.getKey();
            if (name.startsWith(parameterName + '[')) {
                // 执行urldecode
                String tn = name.replaceFirst(parameterName + "\\[", "list[");

                String value = entry.getValue()[0];
                value = replacer(value);
                value = URLDecoder.decode(entry.getValue()[0], "UTF-8");
                map.put(tn, value);
                createItem(tn, revier.getList(), valueClass);
            }
        }
        PropertyValues propertyValues = new MutablePropertyValues(map);

        // 将K-V绑定到binder.target属性上
        binder.bind(propertyValues);
    }

    public static String replacer(String value) {
        String data = value;
        try {
            data = data.replaceAll("%(?![0-9a-fA-F]{2})", "%25");
            data = data.replaceAll("\\+", "%2B");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return data;
    }

    private void createItem(String name, List<Object> users, Class valueClass) {
        int keyStart = name.indexOf(PROPERTY_KEY_SUFFIX);
        int keyEnd = name.indexOf(PROPERTY_KEY_PREFIX);
        String key = name.substring(keyStart + 1, keyEnd);
        int index = Integer.parseInt(key);
        for (int i = users.size(); i < index + 1; i++) {
            users.add(newValue(users.getClass(), valueClass, null, name));
        }
    }

    private Object newValue(Class root, Class<?> type, TypeDescriptor desc, String name) {
        try {
            if (type.isArray()) {
                Class ex1 = type.getComponentType();
                if (ex1.isArray()) {
                    Object array = Array.newInstance(ex1, 1);
                    Array.set(array, 0, Array.newInstance(ex1.getComponentType(), 0));
                    return array;
                } else {
                    return Array.newInstance(ex1, 0);
                }
            } else {
                TypeDescriptor ex;
                if (Collection.class.isAssignableFrom(type)) {
                    ex = desc != null ? desc.getElementTypeDescriptor() : null;
                    return CollectionFactory.createCollection(type, ex != null ? ex.getType() : null, 16);
                } else if (Map.class.isAssignableFrom(type)) {
                    ex = desc != null ? desc.getMapKeyTypeDescriptor() : null;
                    return CollectionFactory.createMap(type, ex != null ? ex.getType() : null, 16);
                } else {
                    return BeanUtils.instantiate(type);
                }
            }
        } catch (Throwable var6) {
            throw new NullValueInNestedPathException(root, name, "Could not instantiate property type [" + type.getName() + "] to auto-grow nested property path", var6);
        }
    }


    protected Object createAttribute(String attributeName, MethodParameter methodParam,
                                     WebDataBinderFactory binderFactory, NativeWebRequest request) throws Exception {
        return new Revier();
    }

    class Revier {
        private List<Object> list = new ArrayList<Object>(0);

        public List<Object> getList() {
            return list;
        }

        public void setList(List<Object> list) {
            this.list = list;
        }
    }

}
