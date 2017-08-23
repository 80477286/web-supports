package com.mouse.web.authorization.local.resource.service;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.resource.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Service
public class ResourceService implements IResourceService {
    @Autowired
    private ResourceRepository repository;


    @Override
    public List<Resource> findAll() {
        return repository.findAll();
    }
}
