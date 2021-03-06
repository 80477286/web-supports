package com.mouse.web.authorization.local.resource.repository;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.supports.jpa.repository.BaseRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Repository
public interface ResourceRepository extends BaseRepository<Resource, String> {

}
