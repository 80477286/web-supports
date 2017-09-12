package com.mouse.web.authorization.local.user.model;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.supports.model.BaseEntity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 用户实体类
 *
 * @author cWX183898
 */
@Entity
@DynamicUpdate(true)
@DynamicInsert(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Table(name = "[System_User]", uniqueConstraints = {@UniqueConstraint(columnNames = {"username"})})
public class User extends BaseEntity {
    private static final long serialVersionUID = -3289281116728574488L;

    @Column(length = 64)
    private String name;

    @Column(length = 64, nullable = false)
    private String username;

    @Column(length = 64, nullable = false)
    private String password;

    @Column(length = 256)
    private String email;

    @Column(nullable = false)
    private Boolean locked = false;

    @Column(nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date accountExpiringDate;

    @Column(nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date credentialsExpiringDate;


    @ManyToMany()
    @JoinTable(name = "System_User_ref_Role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles = new ArrayList<Role>(0);

    public User() {
    }

    public User(String username, String password) {
        super();
        this.username = username;
        this.password = password;
    }

    public User(String username, String password, String name) {
        super();
        this.username = username;
        this.password = password;
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        if (name == null || name.isEmpty()) {
            name = this.username;
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public Boolean getEnabled() {
        return !locked;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public Date getAccountExpiringDate() {
        return accountExpiringDate;
    }

    public void setAccountExpiringDate(Date accountExpiringDate) {
        this.accountExpiringDate = accountExpiringDate;
    }

    public Date getCredentialsExpiringDate() {
        return credentialsExpiringDate;
    }

    public void setCredentialsExpiringDate(Date credentialsExpiringDate) {
        this.credentialsExpiringDate = credentialsExpiringDate;
    }

    public void addRole(Role role) {
        if (this.getRoles() == null) {
            this.setRoles(new ArrayList<Role>(0));
        }
        this.getRoles().add(role);
    }
}
