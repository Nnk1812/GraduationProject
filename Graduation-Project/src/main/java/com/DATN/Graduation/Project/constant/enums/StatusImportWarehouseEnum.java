package com.DATN.Graduation.Project.constant.enums;

import lombok.Getter;

@Getter
public enum StatusImportWarehouseEnum {
    DANG_TAO(1,"Đang tạo phiếu nhập kho"),
    KIEM_TRA(2,"Kiểm tra sản phẩm"),
    HOAN_THANH(3,"Hoàn thành phiếu nhập kho");


    private final Integer value;
    private final String VNValue;

    StatusImportWarehouseEnum(Integer value, String VNValue) {
        this.value = value;
        this.VNValue = VNValue;
    }

    public static String fromValue(Integer value) {
        for (StatusImportWarehouseEnum type : StatusImportWarehouseEnum.values()) {
            if (type.getValue().equals(value)) {
                return type.getVNValue();
            }
        }
        return null;
    }
}
