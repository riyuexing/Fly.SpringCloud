package com.fyp.fly.web.utils;

import com.fyp.fly.common.tools.EncodeUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author fyp
 * @crate 2019/3/11 0:18
 * @project fly
 */
public final class CookieUtils {

    public static String getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(name)) {
                return cookie.getValue();
            }
        }
        return null;
    }

    public static void setCookie(HttpServletResponse response, String name, String value,int maxAge) {
        setCookie(response,name,value,"/",true,maxAge);
    }

    public static void setCookie(HttpServletResponse response, String name, String value,String path,boolean httpOnly,int maxAge) {
        Cookie cookie = new Cookie(name, EncodeUtils.encodeUrl(value));
        cookie.setPath(path);
        cookie.setHttpOnly(httpOnly);
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }
}