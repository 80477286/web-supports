package com.mouse.web.supports.mvc.request;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;

/**
 * Created by cwx183898 on 2017/8/18.
 */
public class PageParam extends PageRequest {
    private static final Log LOG = LogFactory.getLog(PageParam.class);

    public PageParam() {
        super(0, Integer.MAX_VALUE);
    }

    public PageParam(int page, int size) {
        super(page, size);
    }

    public PageParam(int page, int size, Sort.Direction direction, String... properties) {
        super(page, size, direction, properties);
    }

    public PageParam(int page, int size, Sort sort) {
        super(page, size, sort);
    }


    public void setPage(int page) {
        page = page - 1;
        Field field = ReflectionUtils.findField(this.getClass(), "page");
        ReflectionUtils.makeAccessible(field);
        ReflectionUtils.setField(field, this, page);
    }

    public void setSize(int size) {
        Field field = ReflectionUtils.findField(this.getClass(), "size");
        ReflectionUtils.makeAccessible(field);
        ReflectionUtils.setField(field, this, size);
    }

    public void setSort(String val) {
        try {
            if (val != null && !val.trim().isEmpty()) {
                JSONArray json = new JSONArray(val);
                if (json.length() > 0) {
                    Sort sort = null;
                    for (int i = 0; i < json.length(); i++) {
                        JSONObject item = json.getJSONObject(i);
                        Sort.Direction direction = item.getString("direction").equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
                        String property = item.getString("property");
                        if (sort == null) {
                            sort = new Sort(direction, property);
                        } else {
                            sort = sort.and(new Sort(direction, property));
                        }
                    }
                    Field field = ReflectionUtils.findField(this.getClass(), "sort");
                    ReflectionUtils.makeAccessible(field);
                    ReflectionUtils.setField(field, this, sort);
                }
            }
        } catch (JSONException e) {
            LOG.error("排序参数错误：[SORT=" + val + "]", e);
        }
    }
}
