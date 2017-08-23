package com.mouse.web.supports.mvc.converter;

import ch.qos.logback.core.net.ObjectWriter;
import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.PrettyPrinter;
import com.fasterxml.jackson.core.util.DefaultIndenter;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONUtil;
import org.apache.struts2.json.JSONWriter;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.TypeUtils;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class JsonResultHttpMessageConverter extends MappingJackson2HttpMessageConverter {
    @Override
    protected void writeInternal(Object object, Type type, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        MediaType contentType = outputMessage.getHeaders().getContentType();
        JsonEncoding encoding = this.getJsonEncoding(contentType);
        JsonGenerator generator = this.objectMapper.getFactory().createGenerator(outputMessage.getBody(), encoding);

        try {
            boolean excludeNullProperties = false;
            List<Pattern> includeProperties = new ArrayList<Pattern>(0);
            List<Pattern> excludeProperties = new ArrayList<Pattern>(0);
            JSONWriter writer = new JSONWriter();
            writer.setIgnoreHierarchy(false);
            writer.setEnumAsBean(false);
            String json = writer.write(object, excludeProperties, includeProperties, excludeNullProperties);
            outputMessage.getBody().write(json.getBytes("UTF-8"));
            outputMessage.getBody().flush();
        } catch (JSONException e) {
            throw new HttpMessageNotWritableException("Could not write JSON: 序列化JSON数据出现异常!", e);
        } catch (Exception e) {
            throw new HttpMessageNotWritableException("Could not write JSON: 处理结果数据异常!", e);
        }
    }
}
