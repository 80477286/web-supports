package com.mouse.web.authorization.local.role.model;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.supports.model.BaseEntity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.security.access.ConfigAttribute;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 角色实体类
 *
 * @author cWX183898
 */
@DynamicUpdate(true)
@DynamicInsert(true)
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Table(name = "System_Role", uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class Role extends BaseEntity implements ConfigAttribute {
    private static final long serialVersionUID = 2343635839703216816L;


    @Column(length = 64, nullable = false)
    private String name;

    @Column(length = 1024)
    private String description;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "System_Resource_ref_Role", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "resource_id"))
    private List<Resource> resources = new ArrayList<Resource>(0);

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "System_User_ref_Role", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> users = new ArrayList<User>(0);

    public Role() {
    }

    public Role(String name) {
        super();
        this.name = name;
    }

    public Role(String name, String description) {
        super();
        this.name = name;
        this.description = description;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Role) {
            Role data = (Role) obj;
            if (data.getId() != null && this.getId() != null) {
                return data.getId().equals(this.getId());
            }
        }
        return false;
    }

    @Override
    public int hashCode() {
        int hashCode = super.hashCode();
        if (getId() != null) {
            hashCode = getId().hashCode();
        }
        return hashCode;
    }

    @Override
    public String getAttribute() {
        return name;
    }
}
