package com.fyp.fly.web.client.user;

import com.fyp.fly.common.dto.UserModel;
import com.fyp.fly.common.result.api.JsonResult;

/**
 * @author fyp
 * @crate 2019/3/13 21:57
 * @project fly
 */
public interface UserApiClient {
    JsonResult<UserModel> getUserById(Long userId);
}
