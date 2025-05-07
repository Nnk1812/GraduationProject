package com.DATN.Graduation.Project.constant.enums;

import lombok.Getter;

@Getter
public enum OrderStatusEnum {
    CHUA_XAC_NHAN(1,"Chưa xác nhận"),
    DA_XAC_NHAN(2,"Đã xác nhận"),
    DA_CHUYEN_GIAO(3,"Đã đóng gói và chờ chuyển giao tới đơn vị giao hàng"),
    DANG_GIAO_HANG(4,"Đang giao hàng"),
    DA_NHAN_HANG(5,"Đã giao hàng"),
    HUY_DON_HANG(6,"Đơn hàng đã hủy"),
    DA_DANH_GIA(7,"Đã đánh giá sản phẩm trong đơn hàng");

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
