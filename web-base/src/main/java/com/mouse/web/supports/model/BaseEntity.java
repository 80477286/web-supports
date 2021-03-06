package com.mouse.web.supports.model;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

/**
 * 基本实体类，此类包含ID,创建人，创建时间等字段，一个子类一个表，父类不会生成表。
 *
 * @author cWX183898
 */
@MappedSuperclass
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class BaseEntity implements IEntity {
    private static final long serialVersionUID = -5841448194726953221L;

    @Id
    @GenericGenerator(name = "uuidGenerator", strategy = "uuid")
    @GeneratedValue(generator = "uuidGenerator", strategy = GenerationType.IDENTITY)
    @Column(length = 36, nullable = false)
    protected String id;

    @Column(length = 64, nullable = false, updatable = false)
    protected String creator;

    @Column(nullable = false, updatable = false)
    protected Long cdt = new Date().getTime();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        if (id != null && id.trim().isEmpty()) {
            id = null;
        }
        this.id = id;
    }

    public Long getCdt() {
        return cdt;
    }

    public void setCdt(Long cdt) {
        this.cdt = cdt;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

}
