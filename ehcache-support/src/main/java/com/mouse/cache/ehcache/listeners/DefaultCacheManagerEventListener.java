package com.mouse.cache.ehcache.listeners;


import net.sf.ehcache.CacheException;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Status;
import net.sf.ehcache.event.CacheManagerEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DefaultCacheManagerEventListener implements CacheManagerEventListener {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private final CacheManager cacheManager;

    public DefaultCacheManagerEventListener(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Override
    public void init() throws CacheException {
        logger.info("初始化缓存...");
    }

    @Override
    public Status getStatus() {
        return null;
    }

    @Override
    public void dispose() throws CacheException {
        logger.info("缓存释放...");
    }

    @Override
    public void notifyCacheAdded(String s) {
        logger.info("缓存添加... {}", s);
        logger.info(cacheManager.getCache(s).toString());
    }

    @Override
    public void notifyCacheRemoved(String s) {
        logger.info("缓存移除... {}", s);
        logger.info(cacheManager.getCache(s).toString());
    }
}