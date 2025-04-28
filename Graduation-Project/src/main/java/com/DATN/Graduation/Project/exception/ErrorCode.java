package com.DATN.Graduation.Project.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum ErrorCode {
    //Exception of User -1000
    USER_NOT_EXISTED(1001,"User not already existed"),
    USER_EXISTED(1002,"User already existed"),
    USER_NOT_FOUND(1003,"User not found"),
    NOT_AUTHENTICATED(1004,"Not authenticated"),
    EMAIL_EXISTED(1005,"Email already existed"),
    PHONE_EXISTED(1006,"Phone already existed"),
    YOU_DO_NOT_HAVE_PERMISSION(1007,"You don't have permission to perform this action "),
    DISABLE_ACCOUNT(1008,"Tài khoản đã bị vô hiệu hóa"),

    //Exception of Product -1100
    PRODUCT_NOT_EXISTED(1100,"Product not existed"),
    PRODUCT_DETAIL_NOT_EXISTED(1101,"Product detail not existed"),
    CODE_DOSE_NOT_MATCH(1102,"Code dose not match"),
    PRODUCT_EXISTED(1100,"Product already existed"),

    //Exception of Brand -1200
    BRAND_NOT_EXISTED(1200,"Brand not existed"),
    MISSING_BRAND(1201,"Missing brand information"),
    BRAND_EXISTED(1202,"Brand already existed"),

    //Exception of Discount -1300
    DISCOUNT_NOT_EXISTED(1300,"Discount not existed"),
    DISCOUNT_EXISTED(1301,"Discount already existed"),
    VALIDATION_DATE_FALSE(1002,"Start date must be before end date"),
    INVALID_DISCOUNT_TYPE(1003,"Discount type must be 1 or 2"),
    INVALID_DISCOUNT_VALUE(1004,"Discount value must be between 0 and 50"),


    //Exception of Reviews -1400
    VALIDATION_RATING_REVIEW(1400,"Validation rating review"),

    //Exception of Cart -1500
    CART_NOT_EXISTED(1500,"Cart not existed"),

    //Exception of Order -1600
    ORDER_NOT_EXISTED(1600,"Order not existed"),
    ORDER_MUST_HAVE_PRODUCT(1601,"Order must have product"),
    ORDER_DETAIL_NOT_EXISTED(1602,"Order detail not existed"),
    CANNOT_CHANGE_STATUS_TO_CONFIRMED(1603,"Cannot change the status to confirmed "),
    CANNOT_CHANGE_STATUS_TO_TRANSFERRED(1604,"Cannot change the status to transferred"),
    CANNOT_CHANGE_STATUS_TO_DELIVERY(1605,"Cannot change the status to delivery "),
    CANNOT_CHANGE_STATUS_TO_RECEIVED(1606,"Cannot change the status to received "),
    CANNOT_CHANGE_STATUS_TO_CANCELED(1607,"Cannot change the status to canceled "),


    //Exception of Warehouse - 1700
    REPORT_IMPORT_WAREHOUSE_NOT_EXISTED(1700,"Report import warehouse not existed"),
    MUST_HAVE_WAREHOUSE_EMPLOYEE(1701,"Must have warehouse employee "),
    MUST_HAVE_WAREHOUSE_BRAND(1702,"Must have warehouse brand "),
    STATUS_WRONG(1703,"Status of create report import warehouse must be"),
    REPORT_MUST_HAVE_PRODUCT(1704,"Report import warehouse must have product"),
    ;


    private int code;
    private String message;
}
