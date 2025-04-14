package com.DATN.Graduation.Project.exception;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AppException extends RuntimeException {
    public AppException(ErrorCode code) {
        super(code.getMessage());
        this.code = code;
    }

    private ErrorCode code;
}
