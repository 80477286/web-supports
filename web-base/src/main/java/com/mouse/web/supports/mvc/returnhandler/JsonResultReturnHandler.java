package com.mouse.web.supports.mvc.returnhandler;

import com.mouse.web.supports.mvc.bind.annotation.JsonReturn;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.util.Arrays;
import java.util.List;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class JsonResultReturnHandler extends RequestResponseBodyMethodProcessor {
    public JsonResultReturnHandler(List<HttpMessageConverter<?>> converters) {
        super(converters);
    }

    @Override
    public boolean supportsReturnType(MethodParameter returnType) {
        // 如果有我们自定义的 JSON 注解 就用我们这个Handler 来处理
        return returnType.hasMethodAnnotation(JsonReturn.class);
    }


//    @Override
//    public void handleReturnValue(Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer,
//                                  NativeWebRequest webRequest) throws IOException {
//// 设置这个就是最终的处理类了，处理完不再去找下一个类进行处理
//        mavContainer.setRequestHandled(true);
//
//// 获得注解并执行filter方法 最后返回
//        HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);
//
//        response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
//        response.getWriter().write("{\"test\":\"a\"}");
//    }
}
