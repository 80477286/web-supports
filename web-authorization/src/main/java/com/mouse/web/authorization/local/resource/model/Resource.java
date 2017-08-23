package com.mouse.web.authorization.local.resource.model;

import com.mouse.web.authorization.local.role.model.Role;
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
 * 资源实体类
 *
 * @author cWX183898
 */
@DynamicUpdate(true)
@DynamicInsert(true)
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Table(name = "System_Resource", uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "url"})})
public class Resource extends BaseEntity implements ConfigAttribute {
    private static final long serialVersionUID = -4944044646898487415L;

    /**
     * 资源名称
     */
    @Column(length = 512, nullable = false)
    private String name;

    /**
     * 资源URL地址
     */
    @Column(length = 512)
    private String url;

    /**
     * 界面UI地址
     */
    @Column(length = 512)
    private String uiid;

    /**
     * 资源URL描述
     */
    @Column(length = 1024)
    private String description;

    /**
     * 资源所属角色列表
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "System_Resource_ref_Role", joinColumns = @JoinColumn(name = "resource_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles = new ArrayList<Role>(0);

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void addRole(Role role) {
        if (this.getRoles() == null) {
            this.setRoles(new ArrayList<Role>(0));
        }
        this.getRoles().add(role);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Resource) {
            Resource data = (Resource) obj;
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

    public String getUiid() {
        return uiid;
    }

    public void setUiid(String uiid) {
        this.uiid = uiid;
    }

    @Override
    public String getAttribute() {
        return this.url;
    }
}
