package com.mouse.web.authorization.local.role.repository;

import com.mouse.web.authorization.local.role.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    @Query("select r from Role r left join r.resources rs where rs.id=?1")
    List<Role> findByResource(String rid);

    @Query("select r from Role r left join r.users u where u.id=?1")
    List<Role> findByUser(String uid);
}
