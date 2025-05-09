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
    INVALID_OLD_PASSWORD(1009,"invalid old password"),
    PRODUCT_IN_THE_ORDER_CANNOT_BE_HIDDEN(1010,"product in order cannot be hidden"),
    PRODUCT_IN_THE_ORDER_CANNOT_BE_DELETE(1010,"product in order cannot be delete"),

    //Exception of Product -1100
    PRODUCT_NOT_EXISTED(1100,"Product not existed"),
    PRODUCT_DETAIL_NOT_EXISTED(1101,"Product detail not existed"),
    CODE_DOSE_NOT_MATCH(1102,"Code dose not match"),
    PRODUCT_EXISTED(1100,"Product already existed"),
    PRODUCT_NOT_EXISTED_IN_ORDER_OR_STATUS_IN_OR_UNCOMPLETED(1100,"Product not existed in order or status in or uncompleted "),

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
    CANNOT_CHANGE_STATUS_TO_RETURN(1608,"Cannot change the status to return "),
    CANNOT_UPDATE_ORDER_IN_STATUS_DA_CHUYEN_GIAO(1608,"Cannot update order in status da chuyen giao"),
    QUANTITY_IN_ORDER_MUST_BE_SMALLER_THAN_QUANTITY_IN_STOCK(1609,"Quantity in order must be smaller than quantity in stock"),

    //Exception of Warehouse - 1700
    REPORT_IMPORT_WAREHOUSE_NOT_EXISTED(1700,"Report import warehouse not existed"),
    MUST_HAVE_WAREHOUSE_EMPLOYEE(1701,"Must have warehouse employee "),
    MUST_HAVE_WAREHOUSE_BRAND(1702,"Must have warehouse brand "),
    STATUS_WRONG(1703,"Status of create report import warehouse must be"),
    REPORT_MUST_HAVE_PRODUCT(1704,"Report import warehouse must have product"),
    WAREHOUSE_IMPORT_PRODUCT_NOT_EXISTED(1700,"Warehouse import product not existed"),

    //Exception of Report Warranty
    REPORT_WARRANTY_NOT_EXISTED(1800,"Report warrity not existed"),
    REPORT_WARRANTY_MUST_BE_IN_ORDER(1801,"Report warrity must be in order"),
    REPORT_WARRANTY_MUST_HAVE_PRODUCT(1802,"Report warrity must have product"),
    REPORT_WARRANTY_MUST_HAVE_EMPLOYEE(1803,"Repoer warrity must have employee"),
    REPORT_WARRANTY_MUST_HAVE_CUSTOMER(1804,"Repoer warrity must have customer"),
    STATUS_CREATE_REPORT_WARRANTY_MUST_BE_PENDING(1805,"Status of create report warehouse must be"),
    CREATE_REPORT_WARRANTY_WITHOUT_COMPLETE_DATE(1806,"Create report warehouse must have complete date"),
    CANNOT_CHANGE_STATUS_WARRANTY_TO_RECEIVED(1807,"Can not change status to received "),
    CANNOT_CHANGE_STATUS_WARRANTY_TO_IN_PROGRESS(1808, "Can not change status to in progress"),
    CANNOT_CHANGE_STATUS_WARRANTY_TO_COMPLETED(1809, "Can not change status to completed"),
    CANNOT_CHANGE_STATUS_WARRANTY_TO_RETURNED(1810, "Can not change status to returned"),
    CANNOT_CHANGE_STATUS_WARRANTY_TO_REJECTED(1811, "Can not change status to rejected"),
    REPORT_WARRANTY_MUST_HAVE_QUANTITY(1812,"Report warrity must have quantity"),
    QUANTITY_IN_REPORT_MUST_BE_GREATER_THAN_QUANTITY_IN_ORDER(1813,"Quantity in report must be greater than or equal to quantity in order"),
    STATUS_IN_ORDER_MUST_BE_SIX_TO_CLAIM_WARRANTY(1814,"Status of in-order must be complete to claim warranty"),
    WARRANTY_TIME_EXPIRED(1815,"Warrant time expired"),
    ;




    private int code;
    private String message;
}
