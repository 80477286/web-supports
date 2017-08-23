package com.mouse.web.authorization.ldap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.support.BaseLdapPathContextSource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.SpringSecurityLdapTemplate;
import org.springframework.security.ldap.search.LdapUserSearch;
import org.springframework.util.Assert;

import javax.naming.directory.SearchControls;

/**
 * 重新域 用户查询类，实现多个用户组的查询
 *
 * @author cWX183898
 */
public class WebLdapUserSearchImpl implements LdapUserSearch {
    private static final Log logger = LogFactory.getLog(WebLdapUserSearchImpl.class);
    private final ContextSource contextSource;
    private final SearchControls searchControls = new SearchControls();
    private String searchBase = "";
    private final String searchFilter;

    public WebLdapUserSearchImpl(String searchBase, String searchFilter,
                                 BaseLdapPathContextSource contextSource) {
        Assert.notNull(contextSource, "contextSource must not be null");
        Assert.notNull(searchFilter, "searchFilter must not be null.");
        Assert.notNull(searchBase,
                "searchBase must not be null (an empty string is acceptable).");

        this.searchFilter = searchFilter;
        this.contextSource = contextSource;
        this.searchBase = searchBase;

        setSearchSubtree(true);

        if (searchBase.length() == 0) {
            logger.info("SearchBase not set. Searches will be performed from the root: "
                    + contextSource.getBaseLdapPath());
        }
    }

    public DirContextOperations searchForUser(String username) {
        if (logger.isDebugEnabled()) {
            logger.debug("Searching for user '" + username + "', with user search "
                    + this);
        }
        return doSearch(username);
    }

    private DirContextOperations doSearch(String username) {
        SpringSecurityLdapTemplate template = new SpringSecurityLdapTemplate(
                contextSource);

        template.setSearchControls(searchControls);
        UsernameNotFoundException userNotFound = null;
        IncorrectResultSizeDataAccessException notFound = null;
        if (searchBase.contains("|")) {
            String[] sbs = searchBase.split("[|]");
            for (String sb : sbs) {
                if (!sb.trim().isEmpty()) {
                    try {
                        return template.searchForSingleEntry(sb, searchFilter,
                                new String[]{username});
                    } catch (IncorrectResultSizeDataAccessException e) {
                        if (e.getActualSize() == 0) {
                            userNotFound = new UsernameNotFoundException("User " + username
                                    + " not found in directory.");
                        }
                        notFound = e;
                    }
                }
            }
        }
        if (userNotFound != null) {
            throw userNotFound;
        } else {
            throw notFound;
        }

    }


    public void setDerefLinkFlag(boolean deref) {
        searchControls.setDerefLinkFlag(deref);
    }

    public void setSearchSubtree(boolean searchSubtree) {
        searchControls.setSearchScope(searchSubtree ? SearchControls.SUBTREE_SCOPE
                : SearchControls.ONELEVEL_SCOPE);
    }

    public void setSearchTimeLimit(int searchTimeLimit) {
        searchControls.setTimeLimit(searchTimeLimit);
    }

    public void setReturningAttributes(String[] attrs) {
        searchControls.setReturningAttributes(attrs);
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();

        sb.append("[ searchFilter: '").append(searchFilter).append("', ");
        sb.append("searchBase: '").append(searchBase).append("'");
        sb.append(", scope: ")
                .append(searchControls.getSearchScope() == SearchControls.SUBTREE_SCOPE ? "subtree"
                        : "single-level, ");
        sb.append(", searchTimeLimit: ").append(searchControls.getTimeLimit());
        sb.append(", derefLinkFlag: ").append(searchControls.getDerefLinkFlag())
                .append(" ]");
        return sb.toString();
    }

}
