package com.mouse.web.authorization.local.user.model;

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
@Table(name = "[System_Test]")
public class Test extends BaseEntity {
    private static final long serialVersionUID = -3289281116728574488L;

    @Column(length = 64)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
