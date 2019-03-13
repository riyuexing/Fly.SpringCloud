package com.fyp.fly.common.constants;

/**
 * @author fyp
 * @crate 2019/3/9 0:04
 * @project fly
 */
public interface Fly {
    String SSO_COOKIE_KEY = "sso_auth";
    String WEB_COOKIE_KEY = "fly_auth";
    String WEB_ATTRIBUTE_USER_KEY = "fly_current_user";

    String WEB_CACHE_USER_KEY = "app:user:";
    Integer WEB_CACHE_USER_EXPIRE = 600;
}
