package com.DATN.Graduation.Project.constant.enums;

import lombok.Getter;

@Getter
public enum OrderStatusEnum {
    CHUA_XAC_NHAN(1,"Chưa xác nhận"),
    DA_XAC_NHAN(2,"Đã xác nhận"),
    DA_CHUYEN_GIAO(3,"Đã đóng gói và chờ chuyển giao tới đơn vị giao hàng"),
    DANG_GIAO_HANG(4,"Đang giao hàng"),
    DA_GIAO_HANG(5,"Đã giao hàng"),
    DA_NHAN_HANG(6,"Đã nhận hàng"),
    HUY_DON_HANG(7,"Đơn hàng đã hủy"),
    TRA_HANG(8,"Trả hàng"),
    HANG_VE_KHO(9,"Khách hàng đã trả hàng và hàng đã về kho");

    private final Integer value;
    private final String VNValue;

    OrderStatusEnum(Integer value, String VNValue) {
        this.value = value;
        this.VNValue = VNValue;
    }

    public static String fromValue(Integer value) {
        for (OrderStatusEnum type : OrderStatusEnum.values()) {
            if (type.getValue().equals(value)) {
                return type.getVNValue();
            }
        }
        return null;
    }
}
