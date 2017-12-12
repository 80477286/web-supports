package com.mouse.cache.ehcache.listeners;


import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.event.CacheEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 默认缓存事件监听器
 */
public class DefaultCacheEventListener implements CacheEventListener {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void notifyElementRemoved(Ehcache ehcache, Element element) throws CacheException {
        logger.info("删除缓存元素， key = {}， value = {}", element.getObjectKey(), element.getObjectValue());
    }

    @Override
    public void notifyElementPut(Ehcache ehcache, Element element) throws CacheException {
        logger.info("添加缓存元素， key = {}， value = {}", element.getObjectKey(), element.getObjectValue());
    }

    @Override
    public void notifyElementUpdated(Ehcache ehcache, Element element) throws CacheException {
        logger.info("更新缓存元素， key = {}， value = {}", element.getObjectKey(), element.getObjectValue());
    }

    @Override
    public void notifyElementExpired(Ehcache ehcache, Element element) {
        logger.info("缓存元素过期， key = {}， value = {}", element.getObjectKey(), element.getObjectValue());
    }

    @Override
    public void notifyElementEvicted(Ehcache ehcache, Element element) {
        logger.info("驱逐缓存元素，key = {}， value = {}", element.getObjectKey(), element.getObjectValue());
    }

    @Override
    public void notifyRemoveAll(Ehcache ehcache) {
        logger.info("清空缓存. cache name = {}", ehcache.getName());
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException();
    }

    @Override
    public void dispose() {
        logger.info("缓存释放.");
    }
}