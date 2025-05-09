package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.constant.enums.OrderStatusEnum;
import com.DATN.Graduation.Project.constant.enums.StatusPaymentEnum;
import com.DATN.Graduation.Project.dto.*;
import com.DATN.Graduation.Project.entity.*;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.mapper.OrderMapper;
import com.DATN.Graduation.Project.repository.*;
import com.DATN.Graduation.Project.service.DiscountService;
import com.DATN.Graduation.Project.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
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
    @Autowired
    private StockRepository stockRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional
    public OrderDto saveOrder(OrderDto dto) {
        if(!ObjectUtils.isEmpty(dto.getCode())){
            if(!ObjectUtils.isEmpty(orderRepository.findByCode(dto.getId(),dto.getCode()))){
                throw new AppException(ErrorCode.DISCOUNT_EXISTED);
            }
        }
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        dto.setCreatedAt(now);
        dto.setUpdatedAt(now);

        OrderEntity orderEntity;
        if(ObjectUtils.isEmpty(dto.getId())){
            orderEntity = new OrderEntity();
            if(ObjectUtils.isEmpty(dto.getUserNameCustomer()))
            {
                dto.setStatus(OrderStatusEnum.DA_NHAN_HANG.getValue());
            }
            dto.setStatus(OrderStatusEnum.CHUA_XAC_NHAN.getValue());
            if(ObjectUtils.isEmpty(dto.getCode())){
                dto.setCode(generateNextCode());
            }
        }else{
            if(dto.getStatus()>OrderStatusEnum.DA_CHUYEN_GIAO.getValue()){
                throw new AppException(ErrorCode.CANNOT_UPDATE_ORDER_IN_STATUS_DA_CHUYEN_GIAO);
            }
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
                    detailEntity = orderDetailRepository.findById(detail.getId()).orElseThrow(
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
                StockEntity stock = stockRepository.findByProduct(entity.getCode());
                if(detail.getQuantity()>stock.getQuantity()){
                    throw new AppException(ErrorCode.QUANTITY_IN_ORDER_MUST_BE_SMALLER_THAN_QUANTITY_IN_STOCK);
                }
                stock.setQuantity(stock.getQuantity()-detailEntity.getQuantity());
                stockRepository.save(stock);
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
        long deposit = realPrice *10/100;
        if(realPrice>10000000 && realPrice <20000000){
            dto.setDeposit(deposit);
        }else {
            dto.setDeposit(0L);
        }
        dto.setPriceToPay(realPrice+dto.getShippingFee()-dto.getDeposit());

//        Long oldId = orderEntity.getId();

        modelMapper.map(dto, orderEntity);
        OrderEntity savedOrderEntity = orderRepository.save(orderEntity);
//        orderEntity.setId(oldId);
        List<OrderDetailEntity> savedDetails = orderDetailRepository
                .findAllByOrderCode(savedOrderEntity.getCode());

        List<OrderDetailDto> detailDtos = savedDetails.stream()
                .map(entity -> modelMapper.map(entity, OrderDetailDto.class))
                .collect(Collectors.toList());

        OrderDto resultDto = modelMapper.map(savedOrderEntity, OrderDto.class);

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
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
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
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
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
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đang giao hàng";
    }
    public String receive(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.DANG_GIAO_HANG.getValue())){
            dto.setStatus(OrderStatusEnum.DA_GIAO_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_RECEIVED);
        }
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đã giao hàng";
    }
    public String confirm(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.DA_GIAO_HANG.getValue())){
            dto.setStatus(OrderStatusEnum.DA_NHAN_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_RECEIVED);
        }
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
        dto.setPaymentStatus(StatusPaymentEnum.DA_THANH_TOAN.getValue());
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đã giao hàng";
    }
    public String cancel(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(!Objects.equals(dto.getStatus(), OrderStatusEnum.DA_GIAO_HANG.getValue())){
            dto.setStatus(OrderStatusEnum.HUY_DON_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_CANCELED);
        }
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đã hủy đơn hàng thành công";
    }
    @Override
    public String returnProduct(String code){
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                ()-> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        if(Objects.equals(dto.getStatus(), OrderStatusEnum.DA_GIAO_HANG.getValue())){
            dto.setStatus(OrderStatusEnum.TRA_HANG.getValue());
        }else{
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_RETURN);
        }
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
        dto.setPaymentStatus(StatusPaymentEnum.TRA_HANG.getValue());
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);
        return "Đã trả hàng";
    }
    @Override
    public String returnProductToStock(String code) {
        OrderDto dto = orderRepository.findOrderDtoById(code).orElseThrow(
                () -> new AppException(ErrorCode.ORDER_DETAIL_NOT_EXISTED)
        );
        List<OrderDetailEntity> entities = orderDetailRepository.findAllByOrderCode(code);

        if (Objects.equals(dto.getStatus(), OrderStatusEnum.TRA_HANG.getValue())) {
            dto.setStatus(OrderStatusEnum.HANG_VE_KHO.getValue());
        } else {
            throw new AppException(ErrorCode.CANNOT_CHANGE_STATUS_TO_RETURN);
        }
        for (OrderDetailEntity detail : entities) {
            StockEntity stock = stockRepository.findByProduct(detail.getProduct());
            if (stock != null) {
                long newQuantity = stock.getQuantity() + detail.getQuantity();
                stock.setQuantity(newQuantity);
                stockRepository.save(stock);
            }
        }
        LocalDateTime now = LocalDateTime.now();
        dto.setUpdatedAt(now);
        OrderEntity entity = modelMapper.map(dto, OrderEntity.class);
        orderRepository.save(entity);

        return "Đã trả hàng về kho";
    }


    @Override
    public List<OrderEntity> historyOrder(){
        return orderRepository.findAll();
    }
    @Override
    public List<OrderDto> userOrder(String user){

        List<OrderEntity> entities = orderRepository.findOrdersByCustomerCode(user);
        return entities.stream()
                .map(orderEntity -> {
                    OrderDto orderDto = modelMapper.map(orderEntity, OrderDto.class);

                    List<OrderDetailEntity> orderDetails = orderDetailRepository.findAllByOrderCode(orderEntity.getCode());

                    List<OrderDetailDto> detailDtos = orderDetails.stream()
                            .map(detail -> modelMapper.map(detail, OrderDetailDto.class))
                            .collect(Collectors.toList());

                    orderDto.setOrderDetails(detailDtos);

                    return orderDto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public StatisticalDto findAllStatistical(){
        return orderRepository.findAllStatistical();
    }
    @Override
    public StatisticalDto findByDate(Date startDate,Date endDate){
        return orderRepository.findByDate(startDate,endDate);
    }
    @Override
    public List<MonthlyIncomeDto> getMonthlyIncomeByYear(int year) {
        List<Object[]> result = orderRepository.getMonthlyIncome(year);
        List<MonthlyIncomeDto> incomeList = new ArrayList<>();

        for (Object[] row : result) {
            int month = ((Number) row[0]).intValue();
            BigDecimal income = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;
            incomeList.add(new MonthlyIncomeDto(month, income));
        }

        return incomeList;
    }
    @Override
    public StatisticalReviewDto getStatisticalReview() {
        StatisticalReviewDto statisticalReviewDto = reviewRepository.getReviewStatistics();

        Long star1 = statisticalReviewDto.getStar1();
        Long star2 = statisticalReviewDto.getStar2();
        Long star3 = statisticalReviewDto.getStar3();
        Long star4 = statisticalReviewDto.getStar4();
        Long star5 = statisticalReviewDto.getStar5();
        Long totalReviews = statisticalReviewDto.getTotalReviews();

        Double averageRating = 0.0;
        if (totalReviews != 0) {
            averageRating = (star1 * 1.0 + star2 * 2.0 + star3 * 3.0 + star4 * 4.0 + star5 * 5.0) / totalReviews;
        }

        statisticalReviewDto.setAverageRating(averageRating);

        return statisticalReviewDto;
    }
}
