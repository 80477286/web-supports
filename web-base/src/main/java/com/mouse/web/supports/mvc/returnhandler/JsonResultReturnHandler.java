package com.mouse.web.supports.mvc.returnhandler;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.mouse.web.supports.mvc.bind.annotation.JsonReturn;
import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONWriter;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class JsonResultReturnHandler implements HandlerMethodReturnValueHandler {


    @Override
    public boolean supportsReturnType(MethodParameter returnType) {
        // 如果有我们自定义的 JSON 注解 就用我们这个Handler 来处理
        return returnType.hasMethodAnnotation(JsonReturn.class);
    }

    protected ServletServerHttpResponse createOutputMessage(NativeWebRequest webRequest) {
        HttpServletResponse response = (HttpServletResponse) webRequest.getNativeResponse(HttpServletResponse.class);
        return new ServletServerHttpResponse(response);
    }

    @Override
    public void handleReturnValue(Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest) throws IOException {

        try {
            Object target = returnValue;
            if (target != null && PageImpl.class.isAssignableFrom(target.getClass())) {
                target = new PageResult((PageImpl) returnValue);
            }
            mavContainer.setRequestHandled(true);
            ServletServerHttpResponse outputMessage = this.createOutputMessage(webRequest);
            MediaType mediaType = outputMessage.getHeaders().getContentType();
            JsonEncoding encoding = this.getJsonEncoding(mediaType);
            String contentType = "application/json";
            if (encoding != null) {
                contentType += ";charset=" + encoding.getJavaName();
            }
            boolean excludeNullProperties = false;
            List<Pattern> includeProperties = new ArrayList<Pattern>(0);
            List<Pattern> excludeProperties = new ArrayList<Pattern>(0);
            JSONWriter writer = new JSONWriter();
            writer.setIgnoreHierarchy(false);
            writer.setEnumAsBean(false);
            String json = writer.write(target, excludeProperties, includeProperties, excludeNullProperties);
            outputMessage.getServletResponse().setContentType(contentType);
            outputMessage.getBody().write(json.getBytes(encoding.getJavaName()));
            outputMessage.getBody().flush();
        } catch (JSONException e) {
            throw new HttpMessageNotWritableException("JSON数据写入失败：序列化JSON数据出现异常！", e);
        } catch (Exception e) {
            throw new HttpMessageNotWritableException("JSON数据写入失败： 处理过程中发生异常！", e);
        }
    }

    protected JsonEncoding getJsonEncoding(MediaType contentType) {
        if (contentType != null && contentType.getCharset() != null) {
            Charset charset = contentType.getCharset();
            JsonEncoding[] var3 = JsonEncoding.values();
            int var4 = var3.length;

            for (int var5 = 0; var5 < var4; ++var5) {
                JsonEncoding encoding = var3[var5];
                if (charset.name().equals(encoding.getJavaName())) {
                    return encoding;
                }
            }
        }

        return JsonEncoding.UTF8;
    }

    public static class PageResult {
        private PageImpl page;

        public PageResult(PageImpl returnValue) {
            this.page = returnValue;
        }

        public long getTotal() {
            return page.getTotalElements();
        }

        public Object getContent() {
            return page.getContent();
        }
    }
}
