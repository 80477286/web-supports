package com.mouse.web.authorization.local.resource.controller;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.resource.service.IResourceService;
import com.mouse.web.supports.jpa.controller.BaseController;
import com.mouse.web.supports.jpa.service.IBaseService;
import com.mouse.web.supports.mvc.bind.annotation.EntityParam;
import com.mouse.web.supports.mvc.bind.annotation.JSON;
import com.mouse.web.supports.mvc.bind.annotation.MapParam;
import com.mouse.web.supports.mvc.request.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/10.
 */
@RestController
@RequestMapping("/authorization/resource")
public class ResourceController extends BaseController<Resource, String> {
    @Autowired
    private IResourceService resourceService;

    @Override
    protected IBaseService<Resource, String> getService() {
        return resourceService;
    }

    @JSON(excludeProperties = "data.*\\.users\\.resources,data.*\\.roles\\.resources")
    public Resource save(@EntityParam Resource resource) {
        return super.save(resource);
    }

    @Override
    @JSON(excludeProperties = "data.*\\.roles\\.resources,data.*\\.roles\\.users")
    public Resource getById(String id) {
        return super.getById(id);
    }

    @JSON(excludeProperties = "data.*\\.roles")
    public Page<Resource> query(@MapParam Map<String, Object> params, @EntityParam PageParam pageable) {
        return super.query(params, pageable);
    }
}
