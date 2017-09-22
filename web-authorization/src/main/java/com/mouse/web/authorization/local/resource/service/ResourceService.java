package com.mouse.web.authorization.local.resource.service;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.resource.repository.ResourceRepository;
import com.mouse.web.supports.jpa.repository.BaseRepository;
import com.mouse.web.supports.jpa.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Service
public class ResourceService extends BaseService<Resource, String> implements IResourceService {
    @Autowired
    private ResourceRepository repository;

    @Override
    public <S extends Resource> S save(S entity) {
        if (entity.getCreator() == null) {
            String creator = SecurityContextHolder.getContext().getAuthentication().getName();
            entity.setCreator(creator);
        }
        return super.save(entity);
    }

    @Override
    public BaseRepository<Resource, String> getRepository() {
        return repository;
    }
}
