package com.DATN.Graduation.Project.constant.enums;

import lombok.Getter;

@Getter
public enum DiscountTypeEnum {
    TIEN_MAT(1,"Khuyến mãi theo tiền mặt"),
    PHAN_TRAM(2,"Khuyến mãi theo phần trăm");


    private final Integer value;
    private final String VNValue;

    DiscountTypeEnum(Integer value, String VNValue) {
        this.value = value;
        this.VNValue = VNValue;
    }

    public static String fromValue(Integer value) {
        for (DiscountTypeEnum type : DiscountTypeEnum.values()) {
            if (type.getValue().equals(value)) {
                return type.getVNValue();
            }
        }
        return null;
    }
}
