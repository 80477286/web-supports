package com.mouse.web.authorization.local.user;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
import com.mouse.web.example.ExampleApplication;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/16.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {ExampleApplication.class})
@Transactional
public class UserServiceTester {
    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    private IUserService userService;

    private User user;

    @Before
    public void init() {
        User user = new User();
        user.setEmail("testmail");
        user.setUsername("testusername");
        user.setPassword("testpassword");
        user.setName("testname");
        user.setCreator("testSYSTEM");
        user.setLocked(false);
        user.setAccountExpiringDate(DateUtils.addYears(new Date(), 1));
        user.setCredentialsExpiringDate(DateUtils.addYears(new Date(), 1));
        this.user = userService.save(user);
        Assert.assertNotNull(this.user.getId());
    }

    @Test
    public void save() {
        User user = new User();
        user.setEmail("mail");
        user.setUsername("username");
        user.setPassword("password");
        user.setName("name");
        user.setCreator("SYSTEM");
        user.setLocked(false);
        user.setAccountExpiringDate(DateUtils.addYears(new Date(), 1));
        user.setCredentialsExpiringDate(DateUtils.addYears(new Date(), 1));
        User result = userService.save(user);
        Assert.assertNotNull(result.getId());
    }

    @Test
    public void findAll() {
        Map<String, Object> params = new HashMap<String, Object>(0);
        params.put("cdt", user.getCdt());
        Page<User> page = userService.findAll(params, null);
        Assert.assertEquals(page.getContent().size(), 1);
    }

    @Test
    public void findAllPageable() {
        PageRequest pageable = new PageRequest(0, 10);
        Map<String, Object> params = new HashMap<String, Object>(0);
        params.put("cdt", user.getCdt());
        Page<User> page = userService.findAll(params, pageable);
        Assert.assertEquals(page.getContent().size(), 1);
    }

    @Test
    public void findAllPageableAndSort() {

        Sort sort = new Sort(Sort.Direction.ASC, "id");
        PageRequest pageable = new PageRequest(0, 10, sort);
        Map<String, Object> params = new HashMap<String, Object>(0);
        params.put("cdt", user.getCdt());
        Page<User> page = userService.findAll(params, pageable);
        Assert.assertEquals(page.getContent().size(), 1);
    }
}
