package com.fyp.fly.web.client.article;

import com.fyp.fly.common.result.api.JsonResult;
import com.fyp.fly.web.controller.form.ArticleForm;

/**
 * @author fyp
 * @crate 2019/3/16 13:05
 * @project fly
 */
public interface ArticleApiClient {
    JsonResult add(ArticleForm parameter);
}