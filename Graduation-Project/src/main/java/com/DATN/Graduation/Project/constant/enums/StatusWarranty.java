package com.DATN.Graduation.Project.constant.enums;

import lombok.Getter;

@Getter
public enum StatusWarranty {
    PENDING(1,"Chờ xác nhận"),
    RECEIVED(2,"Đã tiếp nhận"),
    IN_PROGRESS(3,"Đang xử lý"),
    COMPLETED(4,"Đã hoàn thành"),
    RETURNED(5,"Đã trả hàng"),
    REJECTED6(6,"Từ chối bảo hành");


    private final Integer value;
    private final String VNValue;

    StatusWarranty(Integer value, String VNValue) {
        this.value = value;
        this.VNValue = VNValue;
    }

    public static String fromValue(Integer value) {
        for (StatusWarranty type : StatusWarranty.values()) {
            if (type.getValue().equals(value)) {
                return type.getVNValue();
            }
        }
        return null;
    }
}
