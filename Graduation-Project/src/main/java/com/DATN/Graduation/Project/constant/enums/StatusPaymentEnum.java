package com.DATN.Graduation.Project.constant.enums;

import lombok.Getter;

@Getter
public enum StatusPaymentEnum {
    DA_THANH_TOAN(1,"Đã thanh toán"),
    CHUA_THANH_TOAN(2,"Chưa thanh toán"),
    TRA_HANG(3,"Trả hàng");

    private final Integer value;
    private final String VNValue;

    StatusPaymentEnum(Integer value, String VNValue) {
        this.value = value;
        this.VNValue = VNValue;
    }

    public static String fromValue(Integer value) {
        for (StatusPaymentEnum type : StatusPaymentEnum.values()) {
            if (type.getValue().equals(value)) {
                return type.getVNValue();
            }
        }
        return null;
    }
}
