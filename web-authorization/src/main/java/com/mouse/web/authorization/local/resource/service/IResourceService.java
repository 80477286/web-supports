package com.mouse.web.authorization.local.resource.service;

import com.mouse.web.authorization.local.resource.model.Resource;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
public interface IResourceService {
    List<Resource> findAll();
}
