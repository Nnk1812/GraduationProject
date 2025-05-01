package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.constant.enums.OrderStatusEnum;
import com.DATN.Graduation.Project.dto.OrderDetailDto;
import com.DATN.Graduation.Project.dto.OrderDto;
import com.DATN.Graduation.Project.entity.OrderDetailEntity;
import com.DATN.Graduation.Project.entity.OrderEntity;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.entity.UserEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.mapper.OrderMapper;
import com.DATN.Graduation.Project.repository.*;
import com.DATN.Graduation.Project.service.DiscountService;
import com.DATN.Graduation.Project.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private ProductRepository productsRepository;
    @Autowired
    private DiscountService discountService;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private UserRepository userRepository;

    public OrderDto saveOrder(OrderDto dto) {
        if(!ObjectUtils.isEmpty(dto.getCode())){
            if(!ObjectUtils.isEmpty(orderRepository.findByCode(dto.getId(),dto.getCode()))){
                throw new AppException(ErrorCode.DISCOUNT_EXISTED);
            }
        }
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        dto.setCreatedAt(now);
        dto.setUpdatedAt(now);
        dto.setStatus(1);

        OrderEntity orderEntity;
        if(ObjectUtils.isEmpty(dto.getId())){
            orderEntity = new OrderEntity();
            if(ObjectUtils.isEmpty(dto.getCode())){
                dto.setCode(generateNextCode());
            }
        }else{
            orderEntity = orderRepository.findById(dto.getId()).orElseThrow(
                    () -> new AppException(ErrorCode.DISCOUNT_NOT_EXISTED)
            );
            dto.setUpdatedAt(now);
        }
        if(!ObjectUtils.isEmpty(dto.getDiscount())){
            if(!discountRepository.findDiscount().contains(dto.getDiscount())){
                throw new AppException(ErrorCode.DISCOUNT_NOT_EXISTED);
            }
        }
        OrderDetailEntity detailEntity ;
        long price=0;
        if(dto.getOrderDetails() != null ){
            List<OrderDetailDto> orderDetails = dto.getOrderDetails();
            for (OrderDetailDto detail : orderDetails) {
                if (detail.getOrderCode() != null ) {
                    detailEntity = orderDetailRepository.findByOrderCode(detail.getOrderCode()).orElseThrow(
                            ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
                    );
                } else {
                    detailEntity = new OrderDetailEntity();
                    detailEntity.setOrderCode(dto.getCode());
                }
                ProductEntity entity = productsRepository.findByCode(detail.getProduct()).orElseThrow(
                        ()-> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
                );
                detailEntity.setName(entity.getName());
                detailEntity.setProduct(entity.getCode());
                detailEntity.setPrice(entity.getRealPrice());
                detailEntity.setImage(entity.getImage());
                detailEntity.setTotalPrice(entity.getRealPrice() * detail.getQuantity());
                price +=entity.getRealPrice() * detail.getQuantity();
                detailEntity.setQuantity(detail.getQuantity());
                orderDetailRepository.save(detailEntity);
            }
        }else{
            throw new AppException(ErrorCode.ORDER_MUST_HAVE_PRODUCT);
        }
        dto.setTotalPrice(price);
        long realPrice =0;
        if(ObjectUtils.isEmpty(dto.getDiscount())){
            realPrice = price;
            dto.setRealPrice(realPrice);
        }else {
            if(discountService.isDiscountValid(dto.getDiscount())){
                if(discountRepository.getDiscountType(dto.getDiscount())==1){
                    realPrice = price - price * discountRepository.getDiscountValue(dto.getDiscount())/100;
                    dto.setRealPrice(realPrice);
                }
                if(discountRepository.getDiscountType(dto.getDiscount())==2){
                    realPrice = price - discountRepository.getDiscountValue(dto.getDiscount());
                    dto.setRealPrice(realPrice);
                }
            }else {
                log.warn("Discount code expired");
            }
        }
        if(realPrice<2000000){
            dto.setShippingFee(50000L);
        }else {
            dto.setShippingFee(0L);
        }
        dto.setPriceToPay(realPrice+dto.getShippingFee());

        // Lưu ID cũ nếu có để tránh lỗi Hibernate
        Long oldId = orderEntity.getId();

        // Map dữ liệu từ DTO vào entity
        modelMapper.map(dto, orderEntity);
        OrderEntity savedOrderEntity = orderRepository.save(orderEntity);
        orderEntity.setId(oldId);
        List<OrderDetailEntity> savedDetails = orderDetailRepository
                .findAllByOrderCode(savedOrderEntity.getCode());

        // 3) Map từng entity thành DTO
        List<OrderDetailDto> detailDtos = savedDetails.stream()
                .map(entity -> modelMapper.map(entity, OrderDetailDto.class))
                .collect(Collectors.toList());

        // 4) Map OrderEntity về OrderDto
        OrderDto resultDto = modelMapper.map(savedOrderEntity, OrderDto.class);

        // 5) Gán list details vào DTO
        resultDto.setOrderDetails(detailDtos);
        return resultDto;
    }

    public String generateNextCode(){
        Integer maxCode = orderRepository.findMaxCodeByPrefix();
        if(maxCode==null){
            return "O001";
        }
        return "O" + String.format("%03d", ++maxCode);
    }
    public OrderDto orderDetail(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        List<OrderDetailEntity> entity = orderDetailRepository.findAllByOrderCode(dto.getCode());
        List<OrderDetailDto> detailDto = orderMapper.toDto(entity);
        dto.setOrderDetails(detailDto);
        return dto;
    }
    public String confirmOrder(String code,String user){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.CHUA_XAC_NHAN.getValue()))
        {
            dto.setStatus(OrderStatusEnum.DA_XAC_NHAN.getValue());
        }else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_CONFIRMED);
        }

        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        entity.setEmployee(user);
        orderRepository.save(entity);
        return "Xác nhận đơn hàng thành công";
    }
    public String transferOrder(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.DA_XAC_NHAN.getValue())){
            dto.setStatus(OrderStatusEnum.DA_CHUYEN_GIAO.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_TRANSFERRED);
        }
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Chuyển giao đơn hàng thành công";
    }
    public String delivery(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.DA_CHUYEN_GIAO.getValue())){
            dto.setStatus(OrderStatusEnum.DANG_GIAO_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_DELIVERY);
        }
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Giao đơn hàng thành công";
    }
    public String receive(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.DANG_GIAO_HANG.getValue())){
            dto.setStatus(OrderStatusEnum.DA_NHAN_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_RECEIVED);
        }
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đã nhận đơn hàng thành công";
    }
    public String cancel(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(!Objects.equals(dto.getStatus(), OrderStatusEnum.DANG_GIAO_HANG.getValue())){
            dto.setStatus(OrderStatusEnum.HUY_DON_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_CANCELED);
        }
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đã hủy đơn hàng thành công";
    }
    public List<OrderEntity> historyOrder(){
        return orderRepository.findAll();
    }
    public List<OrderDto> userOrder(String user){

        List<OrderEntity> entities = orderRepository.findOrdersByCustomerCode(user);
        return entities.stream()
                .map(orderEntity -> {
                    // 1. Map từ OrderEntity -> OrderDto
                    OrderDto orderDto = modelMapper.map(orderEntity, OrderDto.class);

                    // 2. Sau đó, tìm list OrderDetailEntity theo orderId
                    List<OrderDetailEntity> orderDetails = orderDetailRepository.findAllByOrderCode(orderEntity.getCode());

                    // 3. Map list OrderDetailEntity -> list OrderDetailDto
                    List<OrderDetailDto> detailDtos = orderDetails.stream()
                            .map(detail -> modelMapper.map(detail, OrderDetailDto.class))
                            .collect(Collectors.toList());

                    // 4. Set vào OrderDto
                    orderDto.setOrderDetails(detailDtos);

                    return orderDto;
                })
                .collect(Collectors.toList());
    }
}
